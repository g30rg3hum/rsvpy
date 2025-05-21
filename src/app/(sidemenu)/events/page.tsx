"use client";

import PageWrapper from "@/components/layout/page-wrapper";
import ErrorMessage from "@/components/reusables/error-message";
import FetchingInfo from "@/components/reusables/fetching-info";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

type FormData = {
  name: string;
  description: string;
  location: string;
  startDateTime: Date;
  endDateTime?: Date | null;
  totalPrice?: number | null;
};
const schema = yup.object({
  name: yup.string().required("Please enter a name"),
  description: yup.string().required("Please describe your event"),
  location: yup.string().required("Please enter an address."),
  startDateTime: yup
    .date()
    .required("Please enter a start date and time")
    .min(new Date(), "Start date and time must be in the future"),
  endDateTime: yup
    .date()
    .nullable()
    .min(
      yup.ref("startDateTime"),
      "End date cannot be earlier than start date"
    ),
  totalPrice: yup.number(),
});

const fields = Object.keys(schema.fields) as (keyof FormData)[];

const questions = [
  "What is the name of your event?",
  "Describe your event to your guests.",
  "Where is your event located?",
  "When is this event held?",
  "What is the total price of the event?",
];

export default function EventsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn("email", {
        callbackUrl: `/events`,
      });
    },
  });
  const signedIn = status === "authenticated";

  // react form; for multi step form.
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const nextStep = async () => {
    const valid = await trigger(fields[step]);
    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = handleSubmit((data: FormData) => {
    console.log(data);
  });

  return (
    <PageWrapper centerHorizontally>
      {signedIn ? (
        <div>
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

                {/* {step === 3 && (
                  
                )} */}

                <div className="flex justify-between gap-2">
                  {step > 0 ? (
                    <div className="flex-1">
                      <button
                        className="btn w-full"
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
        </div>
      ) : (
        <FetchingInfo />
      )}
    </PageWrapper>
  );
}
