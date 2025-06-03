"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ErrorMessage from "../../../reusables/error-message";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { currencies } from "@/lib/helpers/utils";

const patternTwoDigisAfterComma = /^\d+(\.\d{0,2})?$/;

export type CreateEventFormData = {
  name: string;
  description: string;
  location: string;
  startDateTime: Date;
  endDateTime?: Date | null;
  currency: string;
  totalPrice: number;
  maxAttendees: number;
};
const schema = yup.object({
  name: yup.string().required("Please enter a name"),
  description: yup.string().required("Please describe your event"),
  location: yup.string().required("Please enter an address."),
  startDateTime: yup
    .date()
    .typeError("Please enter a valid date and time")
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .required("Please enter a start date and time")
    .min(new Date(), "Start date must be in the future"),
  endDateTime: yup
    .date()
    .typeError("Please enter a valid date and time")
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .min(yup.ref("startDateTime"), "End date must be after start date"),
  currency: yup.string().required(),
  totalPrice: yup
    .number()
    .typeError("Please enter a number")
    .required()
    .test(
      "valid-price",
      "Please round your price to two decimal places",
      (val: number | undefined) => {
        if (val != undefined) {
          return patternTwoDigisAfterComma.test(String(val));
        }
        return true;
      }
    )
    .min(0, "Must be at least 0"),
  maxAttendees: yup
    .number()
    .typeError("Please enter a number")
    .required()
    .min(0, "Must be at least 1"),
});

const fields = Object.keys(schema.fields) as (keyof CreateEventFormData)[];
fields.splice(4, 2); // remove endDateTime and currency.

const questions = [
  "What is the name of your event?",
  "Describe your event to your guests.",
  "Where is your event located?",
  "When is this event held?",
  "What is the total price of the event?",
  "What is the maximum number of attendees?",
];

interface Props {
  userEmail: string;
}
export default function CreateEventForm({ userEmail }: Props) {
  const router = useRouter();

  // react form; for multi step form.
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    // getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      totalPrice: 0,
      maxAttendees: 1,
    },
  });

  const nextStep = async () => {
    const valid = await (step === 3
      ? trigger(["startDateTime", "endDateTime"])
      : trigger(fields[step]));
    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = handleSubmit(async (data: CreateEventFormData) => {
    const toastId = toast.loading("Creating your event...");

    const {
      name,
      description,
      location,
      startDateTime,
      endDateTime,
      currency,
      totalPrice,
      maxAttendees,
    } = data;

    const res = await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        location,
        startDateTime,
        endDateTime,
        currency,
        totalPrice,
        maxAttendees,
        userEmail,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    toast.dismiss(toastId);

    if (res.ok) {
      toast.success("Event created successfully!");
    } else {
      toast.error("Error encountered when trying to create your event.");
    }

    reset();
    setStep(0);
    (document.getElementById("create_modal") as HTMLDialogElement).close();
    router.refresh();
  });

  return (
    <>
      <div className="mb-2">
        <h2 className="font-bold text-md">{questions[step]}</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {step === 0 && (
          <fieldset className="fieldset">
            <input
              {...register("name")}
              className="w-full input"
              placeholder="Weekly football session"
            />
            {errors.name?.message && (
              <ErrorMessage text={errors.name.message} />
            )}
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="fieldset">
            <textarea
              {...register("description")}
              className="w-full textarea"
              placeholder="Fun little football session with friends."
              wrap="hard"
            />
            {errors.description?.message && (
              <ErrorMessage text={errors.description.message} />
            )}
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="fieldset">
            <textarea
              {...register("location")}
              className="w-full textarea"
              placeholder="Bramley Park Sports Ground, 45 Wellington Road, Manchester M14 5ES, United Kingdom"
              wrap="hard"
            />
            {errors.location?.message && (
              <ErrorMessage text={errors.location.message} />
            )}
          </fieldset>
        )}

        {step === 3 && (
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Start date and time *</legend>
              <input
                {...register("startDateTime")}
                className="w-full input"
                type="datetime-local"
              />
              {errors.startDateTime?.message && (
                <ErrorMessage text={errors.startDateTime.message} />
              )}
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                End date and time (optional)
              </legend>
              <input
                {...register("endDateTime")}
                className="w-full input"
                type="datetime-local"
              />
              {errors.endDateTime?.message && (
                <ErrorMessage text={errors.endDateTime.message} />
              )}
            </fieldset>
          </div>
        )}

        {step === 4 && (
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Currency</legend>
              <select {...register("currency")} className="w-full select">
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Price</legend>
              <input
                {...register("totalPrice")}
                className="w-full input"
                type="number"
                step="0.01"
              />
              {errors.totalPrice?.message && (
                <ErrorMessage text={errors.totalPrice.message} />
              )}
            </fieldset>
          </div>
        )}

        {step === 5 && (
          <div>
            <p className="font-medium font-italics text-stone-500">
              (Including you)
            </p>
            <fieldset className="fieldset">
              <input
                {...register("maxAttendees")}
                className="w-full input"
                type="number"
                step="1"
              />
              {errors.maxAttendees?.message && (
                <ErrorMessage text={errors.maxAttendees.message} />
              )}
            </fieldset>
          </div>
        )}

        <div className="flex justify-between gap-2">
          {step > 0 ? (
            <div className="flex-1">
              <button
                className="btn btn-secondary w-full"
                type="button"
                onClick={prevStep}
              >
                Previous
              </button>
            </div>
          ) : null}
          <div className="flex-1">
            <button
              className="btn btn-primary w-full"
              type="button"
              onClick={step < questions.length - 1 ? nextStep : onSubmit}
              disabled={isSubmitting}
            >
              {step === questions.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
