/* eslint-disable @next/next/no-img-element */
"use client";

import { formatInTimeZone } from "date-fns-tz";
import { Event } from "@/lib/db/types";
import { redirect } from "next/navigation";

interface Props {
  event: Event;
}
export default function EventItem({ event }: Props) {
  return (
    <div className="card w-full md:max-w-[400px] bg-base-200 shadow-xs border border-base-300">
      <figure>
        <img src="/images/sample-event-image.jpg" alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title font-extrabold">{event.title}</h2>
        <div className="space-y-2">
          <p>{event.description}</p>
          <p>
            <b>Held at:</b> {event.location}
          </p>
          <p>
            <b>Times:</b>{" "}
            {formatInTimeZone(event.startDateTime, "UTC", "dd/MM/yyyy (HH:mm)")}
            {event.endDateTime &&
              " - " +
                formatInTimeZone(
                  event.endDateTime,
                  "UTC",
                  "dd/MM/yyyy (HH:mm)"
                )}
          </p>
        </div>
        <div className="mt-3">
          <button
            className="btn btn-accent w-full"
            onClick={() => {
              redirect(`/events/${event.id}`);
            }}
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}
