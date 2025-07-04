import ErrorMessage from "@/components/reusables/error-message";
import { emailRegex } from "@/lib/helpers/utils";
import { PaperAirplaneIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

// separate form for collecting emails
type EmailCollectionFormData = {
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

// still requires the content for the email
interface Props {
  organiserName: string;
  eventName: string;
  eventId: string;
}
// collect a list of email addresses to send to
// requires a react hook form to validate the submitted email addresses.
// clears the list after sending the emails.
export default function SendInviteButton({
  organiserName,
  eventName,
  eventId,
}: Props) {
  const modalId = "send_invite_confirmation_modal";

  // email collection form
  const [emails, setEmails] = useState<string[]>([]);
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
  const onSubmit = handleSubmit((data: EmailCollectionFormData) => {
    const { email } = data;
    setEmails((prevEmails) => [...prevEmails, email]);
    reset();
  });

  const handleSendEmail = async () => {
    const toastId = toast.loading("Sending out all emails...");

    const res = await fetch("/api/emails/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emails: emails,
        organiserName: organiserName,
        eventName: eventName,
        eventId: eventId,
      }),
    });

    const text = await res.text();

    if (res.ok) {
      toast.success(text);
    } else {
      toast.error(text);
    }

    toast.dismiss(toastId);
    setEmails([]);
  };

  function closeModal() {
    (document.getElementById(modalId) as HTMLDialogElement).close();
  }

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
        <div className="modal-box bg-base-200 border border-base-100 max-w-xl max-h-[80vh]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="mt-4">
            <h2 className="font-bold text-lg mb-2">Send invites</h2>
            <p>Enter emails of people you want to invite.</p>
            <form onSubmit={onSubmit}>
              <div className="flex gap-3 items-end">
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
                </fieldset>
                <button className="btn btn-neutral mb-1">Add</button>
              </div>
            </form>
            {errors.email?.message && (
              <ErrorMessage text={errors.email.message} />
            )}
            <ul className="mt-2 flex gap-3 flex-wrap">
              {emails.map((email) => (
                <li key={email} className="flex  gap-2 items-center">
                  <span>{email}</span>{" "}
                  <XCircleIcon
                    className="size-4 hover:cursor-pointer text-error"
                    onClick={() =>
                      setEmails((prev) => prev.filter((el) => el !== email))
                    }
                  />
                </li>
              ))}
            </ul>
            <div className="flex gap-3 mt-5 justify-end">
              <button className="btn btn-neutral" onClick={() => closeModal()}>
                Cancel
              </button>
              <button
                className="btn btn-primary disabled:hidden"
                onClick={async () => {
                  closeModal();
                  handleSendEmail();
                }}
                disabled={isSubmitting || emails.length === 0}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
