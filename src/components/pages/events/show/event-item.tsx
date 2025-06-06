"use client";

import Card from "@/components/reusables/card";
import { formatInTimeZone } from "date-fns-tz";
import { Event } from "@/lib/db/types";
import { redirect } from "next/navigation";
import { CogIcon, TicketIcon } from "@heroicons/react/24/solid";
import { truncateString } from "@/lib/helpers/utils";

interface Props {
  event: Event;
  currentUserEmail: string;
}
export default function EventItem({ event, currentUserEmail }: Props) {
  return (
    <Card bodyClassName="justify-between">
      <div className="flex flex-col gap-2">
        <h2 className="card-title font-bold">
          {event.title}{" "}
          {currentUserEmail === event.creator!.email && (
            <CogIcon className="size-4" />
          )}
          {event
            .attendees!.map((attendee) => {
              return attendee.user!.email;
            })
            .includes(currentUserEmail) && <TicketIcon className="size-4" />}
        </h2>
        <p className="text-slate-300">
          {truncateString(event.description, 105)}
        </p>
        <p>
          <b>Location:</b> {truncateString(event.location, 90)}
        </p>
        <p>
          <b>Dates:</b>{" "}
          {formatInTimeZone(event.startDateTime, "UTC", "dd/MM/yyyy (HH:mm)")}
          {event.endDateTime &&
            " - " +
              formatInTimeZone(event.endDateTime, "UTC", "dd/MM/yyyy (HH:mm)")}
        </p>
      </div>
      <div className="justify-end card-actions mt-3">
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
