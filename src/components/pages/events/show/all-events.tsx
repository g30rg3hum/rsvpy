"use client";

import { CogIcon, FaceFrownIcon, TicketIcon } from "@heroicons/react/24/solid";
import CreateEventModal from "../create/create-modal";
import EventItem from "./event-item";
import { Event } from "@/lib/db/types";
import { useState } from "react";
import clsx from "clsx";

interface Props {
  userEmail: string;
  allEvents: Event[];
}
export default function AllEvents({ userEmail, allEvents }: Props) {
  const [displayOrganised, setDisplayOrganised] = useState(true);
  const [displayAttending, setDisplayAttending] = useState(true);

  const filteredEvents = allEvents.filter((event) => {
    const isOrganizer = event.creator!.email === userEmail;
    const isAttending = event.attendees!.some(
      (attendee) => attendee.user!.email === userEmail
    );

    if (displayOrganised && !displayAttending) {
      return isOrganizer && !isAttending;
    } else if (!displayOrganised && displayAttending) {
      return !isOrganizer && isAttending;
    } else if (displayOrganised && isAttending) {
      return isOrganizer || isAttending;
    } else {
      return false;
    }
  });

  return (
    <>
      <div className="flex relative justify-center w-full mb-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-extrabold mb-4">Events</h1>
          <div className="flex gap-4">
            <div
              className={clsx(
                "badge hover:cursor-pointer",
                displayOrganised
                  ? `bg-accent text-[#171717] hover:bg-[#3BECE9]`
                  : "bg-base-200 hover:bg-[#1a1a1a]"
              )}
              onClick={() => setDisplayOrganised(!displayOrganised)}
            >
              Organised <CogIcon className="size-4" />
            </div>
            <div
              onClick={() => setDisplayAttending(!displayAttending)}
              className={clsx(
                "badge hover:cursor-pointer",
                displayAttending
                  ? `bg-accent text-[#171717] hover:bg-[#3BECE9]`
                  : "bg-base-200 hover:bg-[#1a1a1a]"
              )}
            >
              Attending <TicketIcon className="size-4" />
            </div>
          </div>
        </div>
        <CreateEventModal className="right-0 absolute" userEmail={userEmail} />
      </div>

      {filteredEvents.length === 0 ? (
        <div className="flex justify-center items-center flex-col">
          <FaceFrownIcon className="size-8 mb-2" />
          <p className="font-medium">There are no events here.</p>
          <p className="text-stone-600">
            Amend filter settings, or organise/attend a new event.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredEvents.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              currentUserEmail={userEmail}
            />
          ))}
        </div>
      )}
    </>
  );
}
