import LoginForm from "@/components/authentication/login-form";
import PageWrapper from "@/components/layout/page-wrapper";
import authOptions from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Login() {
  const session = await getServerSession(authOptions);

  const userEmail = session?.user?.email;

  if (userEmail) {
    // User is already logged in, redirect to events page
    return redirect("/events");
  }

  return (
    <PageWrapper centerHorizontally>
      <div className="mx-2">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
