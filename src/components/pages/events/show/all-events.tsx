"use client";

import { CogIcon, FaceFrownIcon, TicketIcon } from "@heroicons/react/24/solid";
import CreateEventModal from "../create/create-modal";
import EventItem from "./event-item";
import { Event } from "@/lib/db/types";
import { useState } from "react";
import clsx from "clsx";
import { checkIsPassedOrUpcomingEvent } from "@/lib/helpers/utils";

interface Props {
  userEmail: string;
  allEvents: Event[];
}
export default function AllEvents({ userEmail, allEvents }: Props) {
  const [displayOrganised, setDisplayOrganised] = useState(true);
  // attending - can be upcoming or already passed events, but where their attendance is not old.
  // i.e. the event has not been restarted into "another" event.
  const [displayAttending, setDisplayAttending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 9;
  const startIndex = currentPage * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;

  const viewableEvents = allEvents.filter((event) => {
    const isOrganizer = event.creator!.email === userEmail;

    const isAttending = event.attendees!.some(
      (attendee) => attendee.user!.email === userEmail && !attendee.old
    );

    if (displayOrganised && !displayAttending) {
      return isOrganizer && !isAttending;
    } else if (!displayOrganised && displayAttending) {
      return !isOrganizer && isAttending;
    } else if (displayOrganised && displayAttending) {
      return isOrganizer && isAttending;
    } else {
      return false;
    }
  });

  // sort each upcoming and past events separately

  // should be sorted recent first
  const sortedUpcomingEvents = viewableEvents
    .filter((event) =>
      checkIsPassedOrUpcomingEvent(
        event.startDateTime,
        event.endDateTime,
        "upcoming"
      )
    )
    .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime());

  // should be sorted where most recent passed event is first
  const sortedPastEvents = viewableEvents
    .filter((event) =>
      checkIsPassedOrUpcomingEvent(
        event.startDateTime,
        event.endDateTime,
        "passed"
      )
    )
    .sort((a, b) => b.startDateTime.getTime() - a.startDateTime.getTime());

  const filteredAndSortedEvents = [
    ...sortedUpcomingEvents,
    ...sortedPastEvents,
  ];

  const searchedEvents = filteredAndSortedEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(
    (searchQuery === "" ? filteredAndSortedEvents : searchedEvents).length /
      eventsPerPage
  );

  const displayedEvents =
    searchQuery === ""
      ? filteredAndSortedEvents.slice(startIndex, endIndex)
      : searchedEvents.slice(startIndex, endIndex);

  return (
    <>
      <div className="w-full flex flex-col items-center max-w-7xl">
        <div className="flex relative justify-center w-full mb-8">
          <div className="flex flex-col items-center max-w-md w-full">
            <h1 className="text-2xl font-extrabold mb-6 sm:mb-4">Events</h1>

            <input
              type="text"
              className="input input-bordered w-full mb-4 mt-1"
              placeholder="Search event name..."
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(0);
              }}
            />

            <div className="flex gap-4">
              <div
                className={clsx(
                  "badge hover:cursor-pointer font-semibold",
                  displayOrganised
                    ? `bg-primary text-primary-content hover:bg-[#2CCEE7]`
                    : "bg-base-100 hover:bg-[#1a1a1a]"
                )}
                onClick={() => {
                  setDisplayOrganised(!displayOrganised);
                  setCurrentPage(0);
                }}
              >
                Organiser <CogIcon className="size-4" />
              </div>
              <div
                onClick={() => {
                  setDisplayAttending(!displayAttending);
                  setCurrentPage(0);
                }}
                className={clsx(
                  "badge hover:cursor-pointer font-semibold",
                  displayAttending
                    ? `bg-primary text-primary-content hover:bg-[#2CCEE7]`
                    : "bg-base-100 hover:bg-[#1a1a1a]"
                )}
              >
                Attendee <TicketIcon className="size-4" />
              </div>
            </div>
          </div>
          <CreateEventModal
            className="right-0 absolute"
            userEmail={userEmail}
          />
        </div>

        {displayedEvents.length === 0 ? (
          <div className="flex justify-center items-center flex-col mt-4">
            <FaceFrownIcon className="size-8 mb-2" />
            <p className="font-medium">There are no events here.</p>
            <p className="text-stone-600">
              Amend filter settings, or organise/attend a new event.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {displayedEvents.map((event) => (
              <EventItem
                key={event.id}
                event={event}
                currentUserEmail={userEmail}
              />
            ))}
          </div>
        )}
      </div>

      {totalPages >= 1 && (
        <div className="mt-8 flex gap-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={clsx(
                "btn btn-sm btn-default",
                index === currentPage && "border border-white"
              )}
              onClick={() => setCurrentPage(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
