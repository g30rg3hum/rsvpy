"use client";

import Card from "@/components/reusables/card";
import { Event } from "@/lib/db/types";
import { CogIcon, TicketIcon } from "@heroicons/react/24/solid";
import {
  checkIsPassedOrUpcomingEvent,
  truncateString,
} from "@/lib/helpers/utils";
import DisplayStartAndEndDates from "@/components/reusables/display-dates";
import Link from "next/link";

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
        <div className="flex justify-between gap-2">
          <h2 className="card-title font-bold break-all">{event.title}</h2>
          <div className="flex items-center gap-2">
            {currentUserEmail === event.creator!.email && (
              <CogIcon className="size-6" />
            )}
            {event
              .attendees!.map((attendee) => {
                return attendee.user!.email;
              })
              .includes(currentUserEmail) && <TicketIcon className="size-6" />}
            {isPassedEvent && (
              <div className="w-5 h-5 bg-success text-success-content rounded-full flex justify-center items-center font-bold text-[10px]">
                ✔
              </div>
            )}
          </div>
        </div>

        <p className="text-slate-300 break-all">
          {truncateString(event.description, 105)}
        </p>
        <p className="break-all">
          <b>Location:</b> {truncateString(event.location, 90)}
        </p>
        <DisplayStartAndEndDates
          startDateTime={event.startDateTime}
          endDateTime={event.endDateTime}
        />
      </div>
      <div className="justify-end card-actions mt-3 w-full">
        <Link href={`/events/${event.id}`}>
          <button className="btn btn-primary w-full sm:w-max">Manage</button>
        </Link>
      </div>
    </Card>
  );
}
