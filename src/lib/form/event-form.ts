import * as yup from "yup";

export const patternTwoDigisAfterComma = /^\d+(\.\d{0,2})?$/;

export type EventFormData = {
  name: string;
  description: string;
  location: string;
  startDateTime: Date;
  endDateTime?: Date | null;
  currency: string;
  totalPrice: number;
  maxAttendees: number;
};

export const schema = yup.object({
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

export const fields = Object.keys(schema.fields) as (keyof EventFormData)[];
fields.splice(4, 2); // remove endDateTime and currency.

export const questions = [
  "What is the name of your event?",
  "Describe your event to your guests.",
  "Where is your event located?",
  "When is this event held?",
  "What is the total price of the event?",
  "What is the maximum number of attendees?",
];
