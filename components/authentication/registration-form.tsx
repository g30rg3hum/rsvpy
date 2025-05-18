import HyperLink from "../reusables/hyperlink";

export default function RegistrationForm() {
  return (
    <div className="card card-border w-[500px] bg-base border">
      <div className="card-body">
        <div className="mb-2">
          <h2 className="card-title">Register</h2>
          <p>
            Create a new account to create and join events. Already have an
            account? <HyperLink href="/login">Login here.</HyperLink>
          </p>
        </div>

        <form className="space-y-4">
          <div>
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

            <fieldset className="fieldset">
              <legend className="fieldset-legend">First name</legend>
              <input className="w-full input" placeholder="John" required />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Last name</legend>
              <input className="w-full input" placeholder="Doe" required />
            </fieldset>
          </div>

          <button className="btn btn-primary w-full">Register</button>
        </form>
      </div>
    </div>
  );
}
