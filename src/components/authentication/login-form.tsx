"use client";
import HyperLink from "../reusables/hyperlink";
import "../../lib/yup/yupLocale";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ErrorMessage from "../reusables/error-message";
import { signIn } from "next-auth/react";
import { emailRegex } from "../../lib/helpers/utils";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

type FormData = {
  email: string;
};

const schema = yup.object({
  email: yup
    .string()
    .matches(emailRegex, { message: "Please enter a valid email" })
    .required(),
});

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = handleSubmit(async (data: FormData) => {
    const toastId = toast.loading("Sending you a login link...");

    const { email } = data;

    const res = await signIn("email", {
      email: email,
      callbackUrl: callbackUrl,
      redirect: false,
    });

    toast.dismiss(toastId);
    if (res?.ok) {
      toast.success("Check your email for a login link.");
    } else {
      toast.success("Email does not exist in our system. Please register.");
    }
  });

  return (
    <div className="card card-border w-[500px] bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="mb-2">
          <h2 className="card-title font-extrabold">Login</h2>
          <p>
            Login to your account by using a magic link sent to your email
            address. Don&apos;t have an account?{" "}
            <HyperLink href="/register">Register here.</HyperLink>
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
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

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={isSubmitting}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
