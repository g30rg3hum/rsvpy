/* eslint-disable @next/next/no-img-element */
import PageWrapper from "@/components/layout/page-wrapper";
import UserDetailsForm from "@/components/pages/profile/user-details-form";
import { getSessionThenEmail } from "@/lib/auth/utils";

export default async function ProfilePage() {
  const userEmail = await getSessionThenEmail("/profile");

  return (
    <PageWrapper centerHorizontally>
      <div className="mx-6 sm:mx-4 w-full max-w-[650px]">
        <div className="card card-border bg-base-200 shadow-xs border border-base-100 w-full">
          <div className="relative card-body">
            <UserDetailsForm userEmail={userEmail} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
