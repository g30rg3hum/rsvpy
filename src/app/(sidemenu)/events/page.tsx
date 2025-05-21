"use client";

import CreateEventForm from "@/components/events/create-form";
import PageWrapper from "@/components/layout/page-wrapper";
import FetchingInfo from "@/components/reusables/fetching-info";
import { signIn, useSession } from "next-auth/react";

export default function EventsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn("email", {
        callbackUrl: `/events`,
      });
    },
  });
  const signedIn = status === "authenticated";

  return (
    <PageWrapper centerHorizontally>
      {signedIn ? (
        <div>
          <CreateEventForm />
        </div>
      ) : (
        <FetchingInfo />
      )}
    </PageWrapper>
  );
}
