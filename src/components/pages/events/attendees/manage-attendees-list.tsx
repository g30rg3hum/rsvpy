"use client";

import DisplayDate from "@/components/reusables/display-date";
import { Event } from "@/lib/db/types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import KickButton from "../update/kick-button";
import { useState } from "react";
import InviteButton from "../invite/invite-button";

interface Props {
  isCreator: boolean;
  isJustAttendee: boolean;
  event: Event;
  isPassedEvent: boolean;
  baseUrl: string;
}
export default function ManageAttendeesList({
  isCreator,
  isJustAttendee,
  event,
  isPassedEvent,
  baseUrl,
}: Props) {
  const [emailFilter, setEmailFilter] = useState("");

  const attendeesToDisplay = isJustAttendee
    ? event.attendees!.filter(
        (attendee) =>
          !attendee.old &&
          (emailFilter !== ""
            ? attendee.user!.email.includes(emailFilter)
            : true)
      )
    : event.attendees!.filter((attendee) =>
        emailFilter !== "" ? attendee.user!.email.includes(emailFilter) : true
      );

  // add pagination to the list
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.max(
    Math.ceil(attendeesToDisplay.length / itemsPerPage),
    1
  );
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const sortedAttendees = attendeesToDisplay.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
  const paginatedAttendees = sortedAttendees.slice(startIndex, endIndex);

  return (
    <>
      <div>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Filter by email address</legend>
          <label className="input w-full max-w-xs">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input
              className="w-full"
              placeholder="email@mail.com"
              onChange={(e) => setEmailFilter(e.target.value)}
            />
          </label>
        </fieldset>
      </div>
      <div className="overflow-x-auto">
        <table className="table relative">
          <thead>
            <tr>
              <th>#</th>
              <th className="text-center">Picture</th>
              <th>Icon</th>
              <th>Email</th>
              <th>Joined at</th>
              {isCreator && (
                <>
                  <th>Payment</th>
                  <th></th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedAttendees
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((attendee, index) => (
                <tr
                  key={attendee.id}
                  className={clsx(attendee.old && "opacity-50")}
                >
                  <td>{attendee.old ? "-" : index + 1}</td>
                  <td>
                    <div
                      className="w-9 h-9 rounded-full bg-center bg-cover mx-auto"
                      style={{
                        backgroundImage: attendee.user!.uploadedPfp
                          ? `url(https://rsvpy.s3.eu-north-1.amazonaws.com/profile-pictures/${
                              attendee.user!.id
                            })`
                          : "url(/images/sample-pfp.jpg)",
                      }}
                    />
                  </td>
                  <td>
                    {attendee.user!.firstName} {attendee.user!.lastName}
                  </td>
                  <td>{attendee.user!.email}</td>
                  <td>
                    <DisplayDate date={attendee.createdAt} />
                  </td>
                  {isCreator && (
                    <>
                      <td>
                        {attendee.payment !== "PENDING" ||
                        attendee.user!.email === event.creator!.email ? (
                          <CheckCircleIcon className="size-5 inline-block" />
                        ) : (
                          <XCircleIcon className="size-5 inline-block" />
                        )}{" "}
                        {attendee.user!.email === event.creator!.email
                          ? "Paid"
                          : attendee.payment.charAt(0).toUpperCase() +
                            attendee.payment.slice(1).toLowerCase()}
                      </td>
                      <td className="text-right">
                        {!isPassedEvent && !attendee.old && (
                          <KickButton
                            attendeeId={attendee.userId}
                            eventId={event.id}
                          />
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
        {isCreator && (
          <div className="right-4 top-4 absolute">
            <InviteButton baseUrl={baseUrl} eventId={event.id} />
          </div>
        )}
      </div>
      <div className="flex gap-3 mt-2">
        <button
          className="btn btn-neutral btn-square btn-sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          <ArrowLeftIcon className="size-3" />
        </button>
        <button
          className="btn btn-neutral btn-square btn-sm"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          <ArrowRightIcon className="size-3" />
        </button>
      </div>
    </>
  );
}
