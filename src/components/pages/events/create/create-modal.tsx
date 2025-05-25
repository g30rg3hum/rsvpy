"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import CreateEventForm from "./create-form";

interface Props {
  userEmail: string;
}
export default function CreateEventModal({ userEmail }: Props) {
  return (
    <>
      <button
        className="btn btn-accent btn-circle"
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
          <h3 className="font-extrabold text-lg">Create a new event</h3>
          <div className="mt-4">
            <CreateEventForm userEmail={userEmail} />
          </div>
        </div>
      </dialog>
    </>
  );
}
