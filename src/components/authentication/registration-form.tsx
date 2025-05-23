"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import HyperLink from "../reusables/hyperlink";
import ErrorMessage from "../reusables/error-message";
import "../../lib/yup/yupLocale";
import toast from "react-hot-toast";
import { emailRegex } from "../../lib/helpers/utils";
import { signIn } from "next-auth/react";

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
};

const schema = yup.object({
  email: yup
    .string()
    .matches(emailRegex, { message: "Please enter a valid email" })
    .required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = handleSubmit(async (data: FormData) => {
    const toastId = toast.loading("Registering your account...");

    const { email, firstName, lastName } = data;

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        firstName,
        lastName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    toast.dismiss(toastId);
    if (res.ok) {
      toast.success(
        "Account created successfully! Check your email for a login link."
      );

      const signInRes = await signIn("email", {
        email: email,
        callbackUrl: `${window.location.origin}`,
        redirect: false,
      });

      if (!signInRes?.ok) {
        toast.error("There was an error sending the login link to your email.");
      }
    } else {
      if (res.status === 409) {
        toast.error("A user with this email already exists, please login.");
      } else {
        // response is just not okay.
        toast.error("Error encountered when creating user");
      }
    }

    reset();
  });

  return (
    <div className="card card-border w-[500px] bg-base-100 shadow-xs border border-base-300">
      <div className="card-body">
        <div className="mb-2">
          <h2 className="card-title font-extrabold">Register</h2>
          <p>
            Create a new account to create and join events. Already have an
            account? <HyperLink href="/login">Login here.</HyperLink>
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email address</legend>
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

            <fieldset className="fieldset">
              <legend className="fieldset-legend">First name</legend>
              <input
                {...register("firstName")}
                className="w-full input"
                placeholder="John"
              />
              {errors.firstName?.message && (
                <ErrorMessage text={errors.firstName.message} />
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Last name</legend>
              <input
                {...register("lastName")}
                className="w-full input"
                placeholder="Doe"
              />
              {errors.lastName?.message && (
                <ErrorMessage text={errors.lastName.message} />
              )}
            </fieldset>
          </div>

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={isSubmitting}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
