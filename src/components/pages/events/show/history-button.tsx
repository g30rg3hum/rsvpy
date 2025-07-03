"use client";

import DisplayDate from "@/components/reusables/display-date";
import { Event } from "@/lib/db/types";
import { ClockIcon } from "@heroicons/react/24/solid";
import { EventRestart } from "@prisma/client";
import clsx from "clsx";

interface Props {
  event: Event;
  eventRestarts: EventRestart[];
  className?: string;
}
export default function HistoryButton({
  event,
  eventRestarts,
  className,
}: Props) {
  return (
    <>
      <div className="tooltip" data-tip="History">
        <button
          className={clsx(
            "btn btn-neutral btn-circle btn-sm btn-icon",
            className
          )}
          onClick={() => {
            (
              document.getElementById("history_modal") as HTMLDialogElement
            ).showModal();
          }}
        >
          <ClockIcon className="size-3" />
        </button>
      </div>

      <dialog id="history_modal" className="modal">
        <div className="modal-box bg-base-200 border border-base-100 max-w-md max-h-[80vh]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="mt-4">
            <h2 className="font-bold text-lg mb-2">History</h2>
            <p className="mb-2">
              <b>Created at:</b> <DisplayDate date={event.createdAt} />
            </p>
            <p>
              <b>Restarted at:</b>{" "}
              {eventRestarts.length === 0 && "no restarts yet."}
            </p>
            <ul>
              {eventRestarts.map((restart) => (
                <li key={restart.id}>
                  › <DisplayDate date={restart.restartDate} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </dialog>
    </>
  );
}
