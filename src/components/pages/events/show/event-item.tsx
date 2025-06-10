"use client";

import Card from "@/components/reusables/card";
import { Event } from "@/lib/db/types";
import { redirect } from "next/navigation";
import {
  CheckCircleIcon,
  CogIcon,
  TicketIcon,
} from "@heroicons/react/24/solid";
import {
  checkIsPassedOrUpcomingEvent,
  truncateString,
} from "@/lib/helpers/utils";
import { useEffect, useState } from "react";

interface Props {
  event: Event;
  currentUserEmail: string;
}
export default function EventItem({ event, currentUserEmail }: Props) {
  // hydration error workaround
  const [localStartDate, setLocalStartDate] = useState<string>();
  const [localEndDate, setLocalEndDate] = useState<string | undefined>();

  const dateDisplayOptions: Intl.DateTimeFormatOptions = {
    timeStyle: "short",
    dateStyle: "short",
  };
  useEffect(() => {
    setLocalStartDate(
      event.startDateTime.toLocaleString(undefined, dateDisplayOptions)
    );
    if (event.endDateTime) {
      setLocalEndDate(
        event.endDateTime.toLocaleString(undefined, dateDisplayOptions)
      );
    }
  });
  const isPassedEvent = checkIsPassedOrUpcomingEvent(
    event.startDateTime,
    event.endDateTime,
    "passed"
  );

  // const currentDate = new Date();
  // const eventStartDate = event.startDateTime;
  // const isPastEvent = currentDate >= eventStartDate;

  // const displayStartDate = event.startDateTime.toLocaleString(undefined, {
  //   dateStyle: "short",
  //   timeStyle: "short",
  // });

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
          {isPassedEvent && <CheckCircleIcon className="size-8 text-success" />}
        </div>

        <p className="text-slate-300">
          {truncateString(event.description, 105)}
        </p>
        <p>
          <b>Location:</b> {truncateString(event.location, 90)}
        </p>
        <p>
          <b>Dates:</b> {localStartDate}
          {event.endDateTime && " - " + localEndDate}
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
