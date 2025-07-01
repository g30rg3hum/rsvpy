"use client";

import { User } from "@/lib/db/types";

interface Props {
  organiserUser: User;
}
export default function OrganiserInfoButton({ organiserUser }: Props) {
  return (
    <>
      <button
        className="btn btn-sm btn-neutral"
        onClick={() =>
          (
            document.getElementById("organiser_info_modal") as HTMLDialogElement
          ).showModal()
        }
      >
        Organiser info
      </button>
      <dialog id="organiser_info_modal" className="modal">
        <div className="modal-box max-w-[400px] bg-base-200 border border-base-100">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="mt-4 text-left">
            <p className="font-bold text-lg">Organiser information</p>
            <p>
              <b>Name:</b> {organiserUser.firstName} {organiserUser.lastName}
            </p>
            <p>
              <b>Email:</b> {organiserUser.email}
            </p>
            <p>
              <b>Payment information:</b>{" "}
              {organiserUser.paymentInformation !== "" &&
              organiserUser.paymentInformation
                ? organiserUser.paymentInformation
                : "not specified. Please contact the organiser."}
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
