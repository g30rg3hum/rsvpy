import HyperLink from "../reusables/hyperlink";

export default function LoginForm() {
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

        <form className="space-y-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email address</legend>
            <label className="input validator w-full">
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
                className="w-full"
                type="email"
                placeholder="email@mail.com"
                required
              />
            </label>
          </fieldset>

          <button className="btn btn-primary w-full">Login</button>
        </form>
      </div>
    </div>
  );
}
