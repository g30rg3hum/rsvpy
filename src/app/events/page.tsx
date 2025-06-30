import PageWrapper from "@/components/layout/page-wrapper";
import AllEvents from "@/components/pages/events/show/all-events";
import { getSessionThenEmail } from "@/lib/auth/utils";
import {
  getPurelyAttendingEventsOfUser,
  getOrganisedEventsOfUser,
} from "@/lib/db/event";

export default async function EventsPage() {
  // this handles a redirect to login if session doesn't exist.
  const userEmail = await getSessionThenEmail("/events");
  const organisedEvents = await getOrganisedEventsOfUser(userEmail);
  const attendingEvents = await getPurelyAttendingEventsOfUser(userEmail);

  const allEvents = [...organisedEvents, ...attendingEvents];
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center w-full h-full px-6 pb-12">
        <AllEvents allEvents={allEvents} userEmail={userEmail} />
      </div>
    </PageWrapper>
  );
}
