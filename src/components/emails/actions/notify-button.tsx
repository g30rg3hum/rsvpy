"use client";

import ErrorMessage from "@/components/reusables/error-message";
import { emailRegex } from "@/lib/helpers/utils";
import { BellAlertIcon } from "@heroicons/react/24/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

type FormData = {
  email: string;
};
const schema = yup.object({
  email: yup
    .string()
    .matches(emailRegex, {
      message: "Please enter a valid email",
    })
    .required(),
});

interface Props {
  eventName: string;
  eventId: string;
}
export default function NotifyButton({ eventName, eventId }: Props) {
  const modalId = "notify_modal";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = handleSubmit(async (data: FormData) => {
    closeModal();

    const { email } = data;

    const toastId = toast.loading("Adding you to the mailing list...");

    // the api endpoint should also create the mailing list record
    // while sending the email
    const res = await fetch("/api/emails/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        eventName,
        eventId,
      }),
    });

    const text = await res.text();

    if (res.ok) {
      toast.success(text);
    } else {
      toast.error(text);
    }

    toast.dismiss(toastId);
    reset();
  });

  const closeModal = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    modal.close();
  };

  return (
    <>
      <button
        className="btn btn-neutral btn-sm btn-circle"
        onClick={() => {
          (document.getElementById(modalId) as HTMLDialogElement).showModal();
        }}
      >
        <BellAlertIcon className="size-3" />
      </button>

      <dialog id={modalId} className="modal">
        <div className="modal-box bg-base-200 border border-base-100 max-w-xl max-h-[80vh]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="mt-4">
            <h2 className="font-bold text-lg mb-2">Notify me</h2>
            <p className="mb-3">
              Join the mailing list and receive an email if a spot frees up from
              being full.
            </p>
            <form onSubmit={onSubmit}>
              <div className="flex gap-3 flex-col">
                <fieldset className="fieldset flex-1">
                  <label className="input w-full">
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
                      {...register("email")}
                      className="w-full"
                      placeholder="email@mail.com"
                    />
                  </label>
                  {errors.email?.message && (
                    <ErrorMessage text={errors.email.message} />
                  )}
                </fieldset>
              </div>
              <div className="flex gap-3 mt-5 justify-end">
                <button
                  className="btn btn-neutral"
                  onClick={() => closeModal()}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary disabled:hidden"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
