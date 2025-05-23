// "use client";

import PageWrapper from "@/components/layout/page-wrapper";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import FetchingInfo from "@/components/reusables/fetching-info";
import EventsList from "@/components/pages/events/events-list";
import CreateEventModal from "@/components/pages/events/create-modal";

export default async function EventsPage() {
  const session = await getServerSession(authOptions);

  const userEmail = session?.user?.email;
  if (!userEmail) {
    // i.e. not signed in.
    redirect("/login?callbackUrl=/events");
  }

  // const { data: session, status } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     signIn("email", {
  //       callbackUrl: `/events`,
  //     });
  //   },
  // });
  // const signedIn = status === "authenticated";

  // only use this if signed in.
  // let userEmail = "";

  // if (signedIn) {
  //   userEmail = session!.user!.email!;
  // }

  return (
    <PageWrapper centerHorizontally>
      {userEmail ? (
        <>
          <div className="w-full space-y-8 px-6">
            <div className="flex justify-end">
              <CreateEventModal userEmail={userEmail} />
            </div>
            <EventsList userEmail={userEmail} />
          </div>
        </>
      ) : (
        <FetchingInfo />
      )}
    </PageWrapper>
  );
}
