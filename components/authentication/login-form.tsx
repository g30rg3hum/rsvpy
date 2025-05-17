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
            <HyperLink href="/">Register here.</HyperLink>
          </p>
        </div>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Enter your email address"
            className="input w-full"
          />
          <button className="btn btn-primary w-full">Login</button>
        </form>
      </div>
    </div>
  );
}
