import RegistrationForm from "@/components/authentication/registration-form";
import PageWrapper from "@/components/layout/page-wrapper";
import authOptions from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Register() {
  const session = await getServerSession(authOptions);

  const userEmail = session?.user?.email;

  if (userEmail) {
    // User is already logged in, redirect to events page
    return redirect("/events");
  }

  return (
    <PageWrapper centerHorizontally>
      <div className="mx-2">
        <RegistrationForm />
      </div>
    </PageWrapper>
  );
}
