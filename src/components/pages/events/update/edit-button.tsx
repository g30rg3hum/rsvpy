"use client";

import { ArrowPathIcon, PencilIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import EditEventForm from "./edit-form";

interface Props {
  className?: string;
  eventId: string;
  isPassedEvent?: boolean;
}
export default function EditButton({
  className,
  eventId,
  isPassedEvent = false,
}: Props) {
  return (
    <>
      <div className="tooltip" data-tip={isPassedEvent ? "Restart" : ""}>
        <button
          className={clsx(
            "btn btn-primary btn-circle btn-sm btn-icon",
            className
          )}
          onClick={() => {
            (
              document.getElementById("edit_modal") as HTMLDialogElement
            ).showModal();
          }}
        >
          {isPassedEvent ? (
            <ArrowPathIcon className="size-3" />
          ) : (
            <PencilIcon className="size-3" />
          )}
        </button>
      </div>

      <dialog id="edit_modal" className="modal">
        <div className="modal-box bg-base-200 border border-base-100 max-w-xl ">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="mt-4">
            <EditEventForm eventId={eventId} />
          </div>
        </div>
      </dialog>
    </>
  );
}
