import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/data/supabase/server-client";

/**
 * Mint a fresh Zoom Server-to-Server OAuth access token.
 * S2S tokens are short-lived (~1h), so we generate on every request.
 */
async function getZoomAccessToken(): Promise<string> {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    throw new Error(
      "Missing Zoom Server-to-Server OAuth env vars (ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET)",
    );
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(
      accountId,
    )}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to obtain Zoom access token (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { connectionId, scheduledAt, durationMinutes, topic } = body;

  if (!connectionId || !scheduledAt || !durationMinutes || !topic) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: connection } = await supabase
    .from("connections")
    .select("*")
    .eq("id", connectionId)
    .single();

  if (
    !connection ||
    (connection.participant_a_id !== user.id && connection.participant_b_id !== user.id)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const accessToken = await getZoomAccessToken();

    const zoomRes = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        type: 2,
        start_time: scheduledAt,
        duration: durationMinutes,
        timezone: "America/Toronto",
        settings: {
          join_before_host: true,
          waiting_room: false,
          meeting_authentication: false,
        },
      }),
    });

    if (!zoomRes.ok) {
      const zoomErr = await zoomRes.text();
      console.error("Zoom API error:", zoomRes.status, zoomErr);
      return NextResponse.json(
        { error: "Failed to create Zoom meeting", detail: zoomErr, status: zoomRes.status },
        { status: 502 },
      );
    }

    const zoomMeeting = await zoomRes.json();

    const { data: meeting, error } = await supabase
      .from("meetings")
      .insert({
        connection_id: connectionId,
        zoom_meeting_id: String(zoomMeeting.id),
        zoom_join_url: zoomMeeting.join_url,
        zoom_start_url: zoomMeeting.start_url,
        scheduled_at: scheduledAt,
        duration_minutes: durationMinutes,
        topic,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to save meeting" }, { status: 500 });
    }

    const partnerId =
      connection.participant_a_id === user.id
        ? connection.participant_b_id
        : connection.participant_a_id;

    await supabase.from("notifications").insert({
      user_id: partnerId,
      type: "meeting_scheduled",
      title: "A call has been scheduled",
      body: topic,
      data: { connection_id: connectionId, meeting_id: meeting.id },
    });

    return NextResponse.json(meeting);
  } catch (err) {
    console.error("Zoom integration error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Zoom integration error", detail: message }, { status: 500 });
  }
}
