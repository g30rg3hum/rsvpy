"use client";

import { EventAttendee } from "@/lib/db/types";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

interface Props {
  attendees: EventAttendee[];
}
export default function AttendeesList({ attendees }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");

  const filteredAttendees = attendees.filter((attendee) =>
    (attendee.user!.firstName + " " + attendee.user!.lastName)
      .toLowerCase()
      .includes(nameFilter)
  );

  const finalAttendees = nameFilter !== "" ? filteredAttendees : attendees;

  const numberOfAttendees = finalAttendees.length;

  const attendeesPerPage = 9;
  const totalPages = Math.max(
    Math.ceil(numberOfAttendees / attendeesPerPage),
    1
  );

  const startIndex = (currentPage - 1) * attendeesPerPage;
  const endIndex = startIndex + attendeesPerPage;

  const attendeesToDisplay = finalAttendees.slice(startIndex, endIndex);

  // search functionality + navigate between pages of 9 attendees
  return (
    <div>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Filter by name</legend>
        <label className="input w-full max-w-[200px]">
          <input
            className="w-full"
            placeholder="John Doe"
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </label>
      </fieldset>
      <ul className="mt-6 grid grid-cols-3 justify-between gap-4 break-all">
        {attendeesToDisplay.map((attendee) => (
          <li
            key={attendee.user!.id}
            className="text-center flex flex-col gap-3 flex justify-center items-center"
          >
            <div
              className="rounded-full w-10 h-10 bg-center bg-cover"
              style={{
                backgroundImage: `url(${
                  attendee.user!.uploadedPfp
                    ? `https://rsvpy.s3.eu-north-1.amazonaws.com/profile-pictures/${
                        attendee.user!.id
                      }`
                    : `/images/sample-pfp.jpg`
                })`,
              }}
            />
            <span>
              {attendee.user!.firstName} {attendee.user!.lastName}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex gap-3 mt-5 justify-center">
        <button
          className="btn btn-neutral btn-square btn-sm disabled:hidden"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ArrowLeftIcon className="size-3" />
        </button>
        <button
          className="btn btn-neutral btn-square btn-sm disabled:hidden"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <ArrowRightIcon className="size-3" />
        </button>
      </div>
    </div>
  );
}
