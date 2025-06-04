import PageWrapper from "@/components/layout/page-wrapper";
import CreateEventModal from "@/components/pages/events/create/create-modal";
import EventItem from "@/components/pages/events/show/event-item";
import { getSessionThenEmail } from "@/lib/auth/utils";
import { getOrganisedEventsOfUser } from "@/lib/db/event";
import { FaceFrownIcon } from "@heroicons/react/24/solid";

export default async function EventsPage() {
  // this handles a redirect to login if session doesn't exist.
  const userEmail = await getSessionThenEmail("/events");
  const events = await getOrganisedEventsOfUser(userEmail);

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center w-full h-full px-6 pb-8">
        <div className="flex relative justify-center w-full mb-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-extrabold mb-4">Events</h1>
            <div className="flex gap-4">
              <div className="badge bg-base-200 hover:cursor-pointer hover:bg-base-100">
                Organised
              </div>
              <div className="badge bg-base-200 hover:cursor-pointer hover:bg-base-100">
                Attending
              </div>
            </div>
          </div>
          <CreateEventModal
            className="right-0 absolute"
            userEmail={userEmail}
          />
        </div>

        {events.length === 0 ? (
          <div className="flex justify-center items-center flex-col">
            <FaceFrownIcon className="size-8 mb-2" />
            <p className="font-medium">You do not currently have any events.</p>
            <p className="text-stone-600">
              Organise a new event or attend an invite.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {events.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
