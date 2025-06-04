"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "../../../reusables/error-message";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { currencies } from "@/lib/helpers/utils";
import { EventFormData, schema } from "@/lib/form/event-form";
import { useEffect, useState } from "react";
import { Event } from "@/lib/db/types";

interface Props {
  userEmail: string;
  eventId: string;
}
export default function EditEventForm({ userEmail, eventId }: Props) {
  const router = useRouter();

  const [eventDetails, setEventDetails] = useState<Event | null>(null);

  // fetch the event details upon getting the form
  useEffect(() => {
    const fetchEventDetails = async () => {
      const res = await fetch(`/api/events/${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setEventDetails(data);
      } else {
        toast.error("Failed to fetch event details.");
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    // trigger,
    // getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // populate the form with event details when they are fetched
  useEffect(() => {
    if (eventDetails) {
      reset({
        name: eventDetails.title,
        description: eventDetails.description,
        location: eventDetails.location,
        startDateTime: eventDetails.startDateTime,
        endDateTime: eventDetails.endDateTime,
        currency: eventDetails.currency,
        totalPrice: eventDetails.totalPrice,
        maxAttendees: eventDetails.maxAttendees,
      });
    }
  }, [eventDetails, reset]);

  const onSubmit = handleSubmit(async (data: EventFormData) => {
    // const toastId = toast.loading("Creating your event...");

    // const {
    //   name,
    //   description,
    //   location,
    //   startDateTime,
    //   endDateTime,
    //   currency,
    //   totalPrice,
    //   maxAttendees,
    // } = data;

    // const res = await fetch("/api/events", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     name,
    //     description,
    //     location,
    //     startDateTime,
    //     endDateTime,
    //     currency,
    //     totalPrice,
    //     maxAttendees,
    //     userEmail,
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // toast.dismiss(toastId);

    // if (res.ok) {
    //   toast.success("Event created successfully!");
    // } else {
    //   toast.error("Error encountered when trying to create your event.");
    // }

    reset();
    (document.getElementById("edit_modal") as HTMLDialogElement).close();
    router.refresh();
  });

  return (
    <>
      <div className="mb-2">
        <h2 className="font-bold text-lg">Edit event</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <input
            {...register("name")}
            className="w-full input"
            placeholder="Weekly football session"
          />
          {errors.name?.message && <ErrorMessage text={errors.name.message} />}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Description</legend>
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

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Location</legend>
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

        <div className="flex gap-4">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Start date and time *</legend>
            <Controller
              name="startDateTime"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full input"
                  type="datetime-local"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().substring(0, 16)
                      : ""
                  }
                />
              )}
            />
            {errors.startDateTime?.message && (
              <ErrorMessage text={errors.startDateTime.message} />
            )}
          </fieldset>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">
              End date and time (optional)
            </legend>
            <Controller
              name="endDateTime"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full input"
                  type="datetime-local"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().substring(0, 16)
                      : ""
                  }
                />
              )}
            />
            {errors.endDateTime?.message && (
              <ErrorMessage text={errors.endDateTime.message} />
            )}
          </fieldset>
        </div>

        <div className="flex gap-4">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Currency</legend>
            <select {...register("currency")} className="w-full select">
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className="fieldset w-full">
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

        <div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Max attendees (including you)
            </legend>
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

        <button
          className="btn btn-primary w-full mt-3"
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          Save
        </button>
      </form>
    </>
  );
}
