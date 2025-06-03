import LoginForm from "@/components/authentication/login-form";
import PageWrapper from "@/components/layout/page-wrapper";
import { Suspense } from "react";

export default function Login() {
  return (
    <PageWrapper centerHorizontally>
      <div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
