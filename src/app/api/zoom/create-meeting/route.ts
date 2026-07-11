import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/data/supabase/server-client";

async function getZoomAccessToken(): Promise<string> {
  // Use the access token from env if available (for hackathon)
  if (process.env.ZOOM_ACCESS_TOKEN) {
    return process.env.ZOOM_ACCESS_TOKEN;
  }

  // Otherwise use Server-to-Server OAuth (account credentials flow)
  const credentials = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch(
    "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=me",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to obtain Zoom access token");
  }

  const data = await res.json();
  return data.access_token;
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

  // Verify user is part of this connection
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
        type: 2, // Scheduled meeting
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
      const zoomErr = await zoomRes.json();
      console.error("Zoom API error:", zoomErr);
      return NextResponse.json({ error: "Failed to create Zoom meeting" }, { status: 502 });
    }

    const zoomMeeting = await zoomRes.json();

    // Save meeting to Supabase
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

    // Notify both participants
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
    return NextResponse.json({ error: "Zoom integration error" }, { status: 500 });
  }
}
