"use client";

import ErrorMessage from "@/components/reusables/error-message";
import { EventAttendee } from "@/lib/db/types";
import { paymentOptions } from "@/lib/helpers/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

type FormData = {
  eventAttendeeId: string;
  payment: string;
};
const schema = yup.object({
  eventAttendeeId: yup.string().required("Event attendee ID is required"),
  payment: yup.string().required(),
});

interface Props {
  attendee: EventAttendee;
}
export default function EditAttendeeButton({ attendee }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      payment: attendee.payment,
      eventAttendeeId: attendee.id,
    },
  });

  const onSubmit = handleSubmit(async (data: FormData) => {
    const toastId = toast.loading("Updating payment status...");

    const res = await fetch(
      `/api/events/${attendee.eventId}/attendees/${attendee.user!.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment: data.payment,
          actualEventAttendeeId: attendee.id,
        }),
      }
    );

    if (res.ok) {
      toast.success("Payment status updated successfully");
    } else {
      toast.error("Failed to update payment status");
    }

    toast.dismiss(toastId);
    router.refresh();

    // close the modal
    (
      document.getElementById(
        "edit_attendee_confirmation_modal"
      ) as HTMLDialogElement
    ).close();
  });

  return (
    <>
      <button
        className="btn btn-sm btn-neutral"
        onClick={() =>
          (
            document.getElementById(
              "edit_attendee_confirmation_modal"
            ) as HTMLDialogElement
          ).showModal()
        }
      >
        Edit
      </button>
      <dialog id="edit_attendee_confirmation_modal" className="modal">
        <div className="modal-box max-w-[400px] bg-base-200 border border-base-100">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() =>
              (
                document.getElementById(
                  "edit_attendee_confirmation_modal"
                ) as HTMLDialogElement
              ).close()
            }
          >
            ✕
          </button>
          <div className="mt-4 text-left">
            <h2 className="font-bold text-lg">Set payment status</h2>
            <form onSubmit={onSubmit}>
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Payment status</legend>
                <select
                  {...register("payment")}
                  className="w-full select"
                  defaultValue={attendee.payment}
                >
                  {["PENDING", ...paymentOptions].map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() +
                        option.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                {errors.payment?.message && (
                  <ErrorMessage text={errors.payment.message} />
                )}
              </fieldset>
              <button
                className="btn btn-primary w-full mt-3"
                type="submit"
                disabled={isSubmitting}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
