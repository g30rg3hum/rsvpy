"use client";
import HyperLink from "../reusables/hyperlink";
import "../../lib/yup/yupLocale";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ErrorMessage from "../reusables/error-message";

type FormData = {
  email: string;
};

const schema = yup.object({
  email: yup.string().email().required(),
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = handleSubmit((data: FormData) => console.log(data));

  return (
    <div className="card card-border w-[500px] bg-base border">
      <div className="card-body">
        <div className="mb-2">
          <h2 className="card-title">Login</h2>
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

          <button className="btn btn-primary w-full" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
