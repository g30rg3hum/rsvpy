"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

export interface Props {
  attendeesPendingPayment: { email: string; name: string }[];
  eventName: string;
  organiserName: string;
}
export default function PayUpButton({
  attendeesPendingPayment,
  eventName,
  organiserName,
}: Props) {
  const modalId = "pay_up_confirmation_modal";

  // email requires the attendees name, email, event name, organiser name.
  const handleSendEmail = async () => {
    // need a loader to indicate emails being sent out
    const toastId = toast.loading("Sending out all the emails...");

    const res = await fetch("/api/emails/pay-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attendeesPendingPayment: attendeesPendingPayment,
        eventName: eventName,
        organiserName: organiserName,
      }),
    });

    const text = await res.text();

    if (res.ok) {
      toast.success(text);
    } else {
      toast.error(text);
    }

    toast.dismiss(toastId);
  };

  return (
    <>
      <button
        className="btn btn-neutral btn-sm btn-circle"
        onClick={() => {
          (document.getElementById(modalId) as HTMLDialogElement).showModal();
        }}
      >
        <PaperAirplaneIcon className="size-3" />
      </button>

      <dialog id={modalId} className="modal">
        <div className="modal-box bg-base-200 border border-base-100 max-w-xl ">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="mt-4">
            <h2 className="font-bold text-lg mb-2">Sending email</h2>
            <p>
              Are you sure you want to send a payment request notification to
              all attendees pending payment?
            </p>
            <div className="flex gap-3 mt-5 justify-end">
              <button
                className="btn btn-neutral"
                onClick={() =>
                  (
                    document.getElementById(modalId) as HTMLDialogElement
                  ).close()
                }
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  (
                    document.getElementById(modalId) as HTMLDialogElement
                  ).close();
                  handleSendEmail();
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
