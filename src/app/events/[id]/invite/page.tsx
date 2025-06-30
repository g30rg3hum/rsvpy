import PageWrapper from "@/components/layout/page-wrapper";
import Card from "@/components/reusables/card";
import authOptions from "@/lib/auth/authOptions";
import { getEventById } from "@/lib/db/event";
import { EnvelopeIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { getServerSession } from "next-auth";
import { formatInTimeZone } from "date-fns-tz";
import JoinButton from "@/components/pages/events/invite/join-button";
import { roundToTwoDp } from "@/lib/helpers/utils";

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
      <div className="flex flex-col w-full items-center px-6 pb-8 gap-4">
        <Card cardClassName="max-w-[600px]">
          <h2 className="card-title font-bold">
            <EnvelopeIcon className="size-6" /> You&apos;re invited!
          </h2>
          <p>
            You&apos;ve been invited to join <b>{event.title}</b>. Here&apos;s
            what you need to know:{" "}
          </p>
          <p>
            <b>Description:</b> {event.description}
          </p>
          <p>
            <b>Location:</b> {event.location}
          </p>
          <p>
            <b>Dates/times:</b>{" "}
            {formatInTimeZone(event.startDateTime, "UTC", "dd/MM/yyyy (HH:mm)")}
            {event.endDateTime &&
              " - " +
                formatInTimeZone(
                  event.endDateTime,
                  "UTC",
                  "dd/MM/yyyy (HH:mm)"
                )}
          </p>
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
        </Card>
        <Card cardClassName="max-w-[600px]">
          <h2 className="card-title font-bold">
            <UserGroupIcon className="size-7" />
            Attendees
          </h2>
          <ul className="mt-2 grid grid-cols-3 justify-between gap-4 break-all">
            {event.attendees
              .filter((attendee) => !attendee.old)
              .map((attendee) => (
                <li
                  key={attendee.user.id}
                  className="text-center flex flex-col gap-3 flex justify-center items-center"
                >
                  <div
                    className="rounded-full w-10 h-10 bg-center bg-cover"
                    style={{
                      backgroundImage: `url(${
                        attendee.user.uploadedPfp
                          ? `https://rsvpy.s3.eu-north-1.amazonaws.com/profile-pictures/${attendee.user.id}`
                          : `/images/sample-pfp.jpg`
                      })`,
                    }}
                  />
                  <span>
                    {attendee.user.firstName} {attendee.user.lastName}
                  </span>
                </li>
              ))}
          </ul>
        </Card>
      </div>
    </PageWrapper>
  );
}
