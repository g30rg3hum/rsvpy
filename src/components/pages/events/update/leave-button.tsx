"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  eventId: string;
  attendeeId: string;
}
export default function LeaveButton({ eventId, attendeeId }: Props) {
  const router = useRouter();

  const handleLeave = async () => {
    try {
      const res = await fetch(
        `/api/events/${eventId}/attendees/${attendeeId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toast.success("Left event successfully.");
        router.push("/events");
      } else {
        toast.error("Failed to leave event.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to leave event.");
    }
  };

  return (
    <>
      <button
        className="btn btn-sm btn-error"
        onClick={() =>
          (
            document.getElementById(
              "leave_confirmation_modal"
            ) as HTMLDialogElement
          ).showModal()
        }
      >
        Leave
      </button>
      <dialog id="leave_confirmation_modal" className="modal">
        <div className="modal-box max-w-[400px] bg-base-200 border border-base-100">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="mt-4 text-left">
            <p className="font-bold text-lg">Confirm your action</p>
            <p>Are you sure you want to leave?</p>
            <div className="flex gap-3 mt-5 justify-end ">
              <button
                className="btn btn-neutral"
                onClick={() =>
                  (
                    document.getElementById(
                      "leave_confirmation_modal"
                    ) as HTMLDialogElement
                  ).close()
                }
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  await handleLeave();
                  (
                    document.getElementById(
                      "leave_confirmation_modal"
                    ) as HTMLDialogElement
                  ).showModal();
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
