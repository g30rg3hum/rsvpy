"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function PayUpButton() {
  const modalId = "pay_up_confirmation_modal";

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
              all unpaid attendees?
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
