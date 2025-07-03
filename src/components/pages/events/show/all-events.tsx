"use client";

import { CogIcon, FaceFrownIcon, TicketIcon } from "@heroicons/react/24/solid";
import CreateEventModal from "../create/create-modal";
import EventItem from "./event-item";
import { Event } from "@/lib/db/types";
import { useState } from "react";
import clsx from "clsx";
import { checkIsPassedOrUpcomingEvent } from "@/lib/helpers/utils";
import Card from "@/components/reusables/card";
import toast from "react-hot-toast";

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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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

  // apply search and date filters
  let searchedEvents = filteredAndSortedEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (startDate) {
    searchedEvents = searchedEvents.filter((event) => {
      // use start date if end date is not set
      if (!event.endDateTime) {
        return event.startDateTime >= startDate;
      } else {
        return event.endDateTime >= startDate;
      }
    });
  }

  // if endDate is not set, use start date as end date.
  if (endDate) {
    searchedEvents = searchedEvents.filter((event) => {
      if (!event.endDateTime) {
        return event.startDateTime <= endDate;
      } else {
        return event.endDateTime <= endDate;
      }
    });
  }

  const searchFiltersApplied = searchQuery !== "" || startDate || endDate;

  const totalPages = Math.ceil(
    (!searchFiltersApplied ? filteredAndSortedEvents : searchedEvents).length /
      eventsPerPage
  );

  const displayedEvents = !searchFiltersApplied
    ? filteredAndSortedEvents.slice(startIndex, endIndex)
    : searchedEvents.slice(startIndex, endIndex);

  return (
    <>
      <div className="w-full flex flex-col items-center max-w-7xl">
        <div className="flex relative justify-center w-full mb-6">
          <div className="flex flex-col items-center w-full">
            <h1 className="text-2xl font-extrabold mb-6">Events</h1>

            <Card cardClassName="w-full sm:w-max">
              <h2 className="text-md font-bold">Filter settings</h2>
              <div className="flex flex-col sm:flex-row w-full gap-1 sm:gap-4 mb-2">
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Title</legend>
                  <input
                    type="text"
                    className="input input-bordered w-full sm:max-w-sm sm:min-w-[200px]"
                    placeholder="Steve's Saturday BBQ"
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(0);
                    }}
                  />
                </fieldset>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">From date</legend>
                  <input
                    type="date"
                    className="input input-bordered w-full sm:max-w-sm sm:min-w-[140px]"
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setStartDate(null);
                      } else {
                        const date = new Date(e.target.value);
                        setStartDate(date);
                        if (endDate && date > endDate) {
                          toast.error("From date cannot be after to date.");
                        }
                      }
                      setCurrentPage(0);
                    }}
                  />
                </fieldset>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">To date</legend>
                  <input
                    type="date"
                    className="input input-bordered w-full sm:max-w-sm sm:min-w-[140px]"
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setEndDate(null);
                      } else {
                        const date = new Date(e.target.value);
                        setEndDate(date);

                        if (startDate && date < startDate) {
                          toast.error("To date cannot be before from date.");
                        }
                      }
                      setCurrentPage(0);
                    }}
                  />
                </fieldset>
              </div>

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
            </Card>
          </div>
          <CreateEventModal
            className="right-0 absolute"
            userEmail={userEmail}
          />
        </div>

        {displayedEvents.length === 0 ? (
          <div className="flex justify-center items-center flex-col mt-4 text-center">
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
