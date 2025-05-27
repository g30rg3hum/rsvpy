"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import CreateEventForm from "./create-form";
import clsx from "clsx";

interface Props {
  userEmail: string;
  className?: string;
}
export default function CreateEventModal({ userEmail, className }: Props) {
  return (
    <>
      <button
        className={clsx("btn btn-accent btn-circle", className)}
        onClick={() =>
          (
            document.getElementById("create_modal") as HTMLDialogElement
          ).showModal()
        }
      >
        <PlusIcon className="size-6" />
      </button>
      <dialog id="create_modal" className="modal">
        <div className="modal-box w-[1000px]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="mt-4">
            <CreateEventForm userEmail={userEmail} />
          </div>
        </div>
      </dialog>
    </>
  );
}
