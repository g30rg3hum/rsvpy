"use client";

import Card from "@/components/reusables/card";
import { Event } from "@/lib/db/types";
import { redirect } from "next/navigation";
import { CogIcon, TicketIcon } from "@heroicons/react/24/solid";
import {
  checkIsPassedOrUpcomingEvent,
  truncateString,
} from "@/lib/helpers/utils";
import DisplayStartAndEndDates from "@/components/reusables/display-dates";

interface Props {
  event: Event;
  currentUserEmail: string;
}
export default function EventItem({ event, currentUserEmail }: Props) {
  const isPassedEvent = checkIsPassedOrUpcomingEvent(
    event.startDateTime,
    event.endDateTime,
    "passed"
  );

  return (
    <Card bodyClassName="justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
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
          {isPassedEvent && (
            <div className="w-8 h-8 bg-success text-success-content rounded-full flex justify-center items-center font-bold">
              ✔
            </div>
          )}
        </div>

        <p className="text-slate-300">
          {truncateString(event.description, 105)}
        </p>
        <p>
          <b>Location:</b> {truncateString(event.location, 90)}
        </p>
        <DisplayStartAndEndDates
          startDateTime={event.startDateTime}
          endDateTime={event.endDateTime}
        />
      </div>
      <div className="justify-end card-actions mt-3">
        <button
          className="btn btn-neutral"
          onClick={() => redirect(`/events/${event.id}`)}
        >
          Manage
        </button>
      </div>
    </Card>
  );
}
