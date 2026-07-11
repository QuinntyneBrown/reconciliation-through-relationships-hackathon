"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Profile } from "@/data/supabase/database.types";

type Props = {
  participants: Profile[];
};

export default function ParticipantMap({ participants }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  // Only participants who consented and have coordinates
  const mappable = useMemo(
    () => participants.filter((p) => p.map_consent && p.lat && p.lng),
    [participants],
  );

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-96, 60], // Canada center
      zoom: 3.5,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapInstance.current = map;

    map.on("load", () => {
      mappable.forEach((participant) => {
        if (!participant.lat || !participant.lng) return;

        const el = document.createElement("div");
        el.className = "participant-marker";
        el.style.cssText = `
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid white;
          background: ${participant.is_indigenous ? "var(--spruce-700)" : "var(--river-700)"};
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          font-weight: bold;
        `;
        el.textContent =
          `${participant.first_name?.[0] ?? ""}${participant.last_name?.[0] ?? ""}`.toUpperCase();

        const popup = new mapboxgl.Popup({ offset: 16, closeButton: false }).setHTML(`
          <div style="padding: 4px; min-width: 140px;">
            <p style="font-weight: 600; font-size: 13px; margin: 0 0 2px;">
              ${participant.first_name} ${participant.last_name}
            </p>
            <p style="font-size: 11px; color: #666; margin: 0 0 2px;">
              ${participant.city}, ${participant.province}
            </p>
            <p style="font-size: 11px; color: ${participant.is_indigenous ? "var(--spruce-700)" : "var(--river-700)"}; margin: 0;">
              ${participant.is_indigenous ? "Indigenous" : "Non-Indigenous"}
            </p>
          </div>
        `);

        new mapboxgl.Marker({ element: el })
          .setLngLat([participant.lng!, participant.lat!])
          .setPopup(popup)
          .addTo(map);
      });
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [mappable]);

  if (mappable.length === 0) {
    return (
      <div className="border-border bg-muted/30 text-muted-foreground flex h-96 items-center justify-center rounded-xl border text-sm">
        No participants have consented to map display in this view.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-muted-foreground flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="bg-spruce-700 inline-block h-3 w-3 rounded-full" />
          Indigenous participant
        </span>
        <span className="flex items-center gap-1">
          <span className="bg-river-700 inline-block h-3 w-3 rounded-full" />
          Non-Indigenous participant
        </span>
      </div>
      <div ref={mapRef} className="border-border h-[500px] overflow-hidden rounded-xl border" />
      <p className="text-muted-foreground text-xs">
        Only showing participants who consented to map display. Locations are city-level only.
      </p>
    </div>
  );
}
