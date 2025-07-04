"use client";

import { TrashIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  eventId: string;
  className?: string;
}
export default function DeleteButton({ eventId, className }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Event has been successfully deleted.");
        router.push("/events");
      } else {
        toast.error("Failed to delete the event.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An error occurred while deleting the event.");
    }
  };

  return (
    <>
      <button
        className={clsx("btn btn-error btn-circle btn-sm btn-icon", className)}
        onClick={() => {
          (
            document.getElementById("delete_event_modal") as HTMLDialogElement
          ).showModal();
        }}
      >
        <TrashIcon className="size-3" />
      </button>
      <dialog id="delete_event_modal" className="modal">
        <div className="modal-box bg-base-200 border border-base-100 max-w-xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="mt-4 text-left">
            <p className="font-bold text-lg">Confirm your action</p>
            <p>Are you sure you want to delete this event?</p>
            <div className="flex gap-3 mt-5 justify-end">
              <button
                className="btn btn-neutral"
                onClick={() =>
                  (
                    document.getElementById(
                      "delete_event_modal"
                    ) as HTMLDialogElement
                  ).close()
                }
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  // await handleKick();
                  handleDelete();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
