import LoginForm from "../../components/authentication/login-form";
import PageWrapper from "../../components/layout/page-wrapper";

export default function Login() {
  return (
    <PageWrapper centerHorizontally>
      <div className="mt-[5%]">
        <LoginForm />
      </div>
    </PageWrapper>
  );
}
