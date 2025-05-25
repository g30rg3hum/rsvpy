"use client";

import { formatInTimeZone } from "date-fns-tz";
import { Event } from "@/lib/db/types";
import Image from "next/image";
import { redirect } from "next/navigation";

interface Props {
  event: Event;
}
export default function EventItem({ event }: Props) {
  return (
    <div className="card w-[450px] bg-base-100 shadow-xs border border-base-300">
      <figure>
        <Image
          src="/images/sample-event-image.jpg"
          alt="Shoes"
          width={450}
          height={250}
        />
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
            className="btn btn-primary w-full"
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
