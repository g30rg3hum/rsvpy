"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ErrorMessage from "../reusables/error-message";

const patternTwoDigisAfterComma = /^\d+(\.\d{0,2})?$/;

type FormData = {
  name: string;
  description: string;
  location: string;
  startDateTime: Date;
  endDateTime?: Date | null;
  totalPrice: number;
};
const schema = yup.object({
  name: yup.string().required("Please enter a name"),
  description: yup.string().required("Please describe your event"),
  location: yup.string().required("Please enter an address."),
  startDateTime: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .required("Please enter a start date and time"),
  endDateTime: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr)),
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
});

const fields = Object.keys(schema.fields) as (keyof FormData)[];

const questions = [
  "What is the name of your event?",
  "Describe your event to your guests.",
  "Where is your event located?",
  "When is this event held?",
  "What is the total price of the event?",
];

export default function CreateEventForm() {
  // react form; for multi step form.
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { totalPrice: 0 },
  });

  const nextStep = async () => {
    const valid = await (step === 3
      ? trigger(["startDateTime", "endDateTime"])
      : trigger(fields[step]));
    if (valid) setStep((prev) => prev + 1);
    console.log(getValues("startDateTime"));
    console.log(typeof getValues("endDateTime"));
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = handleSubmit((data: FormData) => {
    console.log(data);
  });

  return (
    <div className="card card-border w-[500px] bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="mb-2">
          <h2 className="card-title font-extrabold text-lg">
            {questions[step]}
          </h2>
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
                <legend className="fieldset-legend">
                  Start date and time *
                </legend>
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

          <div className="flex justify-between gap-2">
            {step > 0 ? (
              <div className="flex-1">
                <button className="btn w-full" type="button" onClick={prevStep}>
                  Previous
                </button>
              </div>
            ) : null}
            <div className="flex-1">
              <button
                className="btn btn-primary w-full"
                type="button"
                onClick={step < 4 ? nextStep : onSubmit}
                disabled={isSubmitting}
              >
                {step === 4 ? "Submit" : "Next"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
