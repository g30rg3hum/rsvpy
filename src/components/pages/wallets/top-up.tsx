"use client";

import ErrorMessage from "@/components/reusables/error-message";
import { currencies } from "@/lib/helpers/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

type FormData = {
  amount: number;
  currency: string;
};
const schema = yup.object({
  amount: yup
    .number()
    .typeError("Please enter a number")
    .min(1, "Amount must be at least 1")
    .required(),
  currency: yup.string().required(),
});

export default function TopUpForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = handleSubmit(async (data: FormData) => {});

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <fieldset className="fieldset">
        <legend className="fieldset-legend"> Amount</legend>
        <label className="input w-full">
          <input
            {...register("amount")}
            className="w-full"
            placeholder="0"
            type="number"
            min="1"
            step="0.01"
          />
        </label>
        {errors.amount?.message && (
          <ErrorMessage text={errors.amount.message} />
        )}
      </fieldset>
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
      <button
        className="btn btn-primary w-full mt-4"
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        Top up
      </button>
    </form>
  );
}
