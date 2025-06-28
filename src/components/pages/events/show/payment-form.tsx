"use client";

import { paymentOptions } from "@/lib/helpers/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

type FormData = {
  paymentOption: string;
};
const schema = yup.object({
  paymentOption: yup.string().required("Please select a payment option"),
});

interface Props {
  paid: boolean;
  eventId: string;
  attendeeId: string;
}
export default function PaymentForm({ paid, eventId, attendeeId }: Props) {
  const router = useRouter();

  // get the current payment value from attendee record
  const [currentPayment, setCurrentPayment] = useState<string | null>(null);

  useEffect(() => {
    // get the current payment value from attendee record and set it.
    const fetchCurrentPayment = async () => {
      const res = await fetch(`/api/events/${eventId}/attendees/${attendeeId}`);

      if (res.ok) {
        const data = await res.json();
        if (data.payment !== "PENDING") {
          console.log("Current payment:", data.payment);
          setCurrentPayment(data.payment);
        }
      }
    };

    fetchCurrentPayment();
  });

  const {
    register,
    handleSubmit,
    // reset,
    // trigger,
    // getValues,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      paymentOption: currentPayment || "TRANSFERRED",
    },
  });

  const onSubmit = handleSubmit(async (data: FormData) => {
    const toastId = toast.loading("Updating payment status...");

    if (paid) {
      // set the event attendee record as paid
      const res = await fetch(
        `/api/events/${eventId}/attendees/${attendeeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payment: "PENDING" }),
        }
      );

      if (res.ok) {
        toast.success("Payment status updated to unpaid.");
        setCurrentPayment(null);
      } else {
        toast.error("Failed to update payment status.");
      }
    } else {
      // set the event attendee record as paid
      const res = await fetch(
        `/api/events/${eventId}/attendees/${attendeeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payment: data.paymentOption }),
        }
      );

      if (res.ok) {
        toast.success("Payment status updated.");
      } else {
        toast.error("Failed to update payment status.");
      }
    }

    toast.dismiss(toastId);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Paid by</legend>
        <select
          {...register("paymentOption")}
          className="w-full select"
          disabled={paid}
          value={currentPayment || undefined}
        >
          {paymentOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </fieldset>
      <button
        className="btn btn-primary w-full"
        type="submit"
        disabled={isSubmitting}
      >
        {paid ? "Set as unpaid" : "Set as paid"}
      </button>
    </form>
  );
}
