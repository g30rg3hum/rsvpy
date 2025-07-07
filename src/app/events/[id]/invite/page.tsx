import PageWrapper from "@/components/layout/page-wrapper";
import Card from "@/components/reusables/card";
import authOptions from "@/lib/auth/authOptions";
import { getEventById } from "@/lib/db/event";
import { EnvelopeIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { getServerSession } from "next-auth";
import JoinButton from "@/components/pages/events/invite/join-button";
import { roundToTwoDp } from "@/lib/helpers/utils";
import AttendeesList from "@/components/pages/events/invite/attendees-list";
import DisplayStartAndEndDates from "@/components/reusables/display-dates";
import NotifyButton from "@/components/emails/actions/notify-button";

interface Props {
  params: Promise<{ id: string }>;
}
export default async function EventInvitePage({ params }: Props) {
  const { id } = await params;

  // get the session, if doesn't exist, guide user to login
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  // still display the invite page.

  // get the event by id
  const event = await getEventById(id);
  if (!event) {
    throw new Error("Event for which the invite is for does not exist.");
  }

  return (
    <PageWrapper centerHorizontally>
      <div className="flex flex-col w-full items-center px-6 pb-8 gap-6">
        <Card cardClassName="max-w-[600px] relative">
          <h2 className="card-title font-bold">
            <EnvelopeIcon className="size-6" /> You&apos;re invited!
          </h2>
          <p>
            You&apos;ve been invited by{" "}
            <b>
              {event.creator.firstName} {event.creator.lastName}
            </b>{" "}
            to join <b>{event.title}</b>. Here&apos;s what you need to
            know:{" "}
          </p>
          <p>
            <b>Description:</b> {event.description}
          </p>
          <p>
            <b>Location:</b> {event.location}
          </p>
          <DisplayStartAndEndDates
            startDateTime={event.startDateTime}
            endDateTime={event.endDateTime}
          />
          <p>
            <b>Total price (to be divided):</b> {event.currency}{" "}
            {event.totalPrice.toFixed(2)}
          </p>
          <p>
            <b>Expected price per person:</b> {event.currency}{" "}
            {roundToTwoDp(event.totalPrice / event.maxAttendees).toFixed(2)}
          </p>
          <p>
            <b>Attendee count:</b>{" "}
            {event.attendees.filter((attendee) => !attendee.old).length} /{" "}
            {event.maxAttendees}
          </p>
          <div className="card-actions mt-3 w-full">
            <JoinButton userEmail={userEmail} eventId={event.id} />
          </div>
          <div className="absolute top-3 right-3">
            <NotifyButton eventName={event.title} eventId={event.id} />
          </div>
        </Card>
        <Card cardClassName="max-w-[600px]">
          <h2 className="card-title font-bold">
            <UserGroupIcon className="size-7" />
            Attendees
          </h2>
          <AttendeesList
            attendees={event.attendees.filter((attendee) => !attendee.old)}
          />
        </Card>
      </div>
    </PageWrapper>
  );
}
