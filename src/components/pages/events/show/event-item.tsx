"use client";

import Card from "@/components/reusables/card";
import { formatInTimeZone } from "date-fns-tz";
import { Event } from "@/lib/db/types";
import { redirect } from "next/navigation";

interface Props {
  event: Event;
}
export default function EventItem({ event }: Props) {
  return (
    <Card>
      <h2 className="card-title font-bold">{event.title}</h2>
      <p className="text-slate-300">{event.description}</p>
      <p>
        <b>Location:</b> {event.location}
      </p>
      <p>
        <b>Dates:</b>{" "}
        {formatInTimeZone(event.startDateTime, "UTC", "dd/MM/yyyy (HH:mm)")}
        {event.endDateTime &&
          " - " +
            formatInTimeZone(event.endDateTime, "UTC", "dd/MM/yyyy (HH:mm)")}
      </p>
      <div className="justify-end card-actions mt-2">
        <button
          className="btn btn-primary"
          onClick={() => redirect(`/events/${event.id}`)}
        >
          Manage
        </button>
      </div>
    </Card>
  );
}
