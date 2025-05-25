import AttendButton from "@/components/pages/events/invite/attend-button";
import authOptions from "@/lib/auth/authOptions";
import { getEventById } from "@/lib/db/event";
import { roundToTwoDp } from "@/lib/helpers/utils";
import { getServerSession } from "next-auth";
import { ErrorIcon } from "react-hot-toast";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventInvitePage({ params }: Props) {
  const { id } = await params;

  // get session
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  // fetch the event by id
  const event = await getEventById(id);

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        {event ? (
          <>
            <h2 className="font-extrabold text-4xl">
              You&apos;re{" "}
              <span className="underline decoration-6 decoration-primary">
                invited!
              </span>
            </h2>
            <div className="card card-border w-[600px] bg-base-100 shadow-xs border border-base-300">
              <div className="card-body">
                <h3 className="text-xl card-title font-bold">{event.title}</h3>
                <p>
                  <b>Description:</b> {event.description}
                </p>
                <p>
                  <b>Located at:</b> {event.location}
                </p>
                <p>
                  <b>Start:</b> {event.startDateTime.toLocaleString()}
                </p>
                {event.endDateTime && (
                  <p>
                    <b>End: </b> {event.endDateTime.toLocaleString()}
                  </p>
                )}
                {event.totalPrice > 0 && (
                  <p>
                    <b>Price to pay (if all attend):</b> {event.currency}{" "}
                    {roundToTwoDp(event.totalPrice / event.maxAttendees)}
                  </p>
                )}
                <p>
                  <b>Max attendees:</b> {event.maxAttendees}
                </p>
                <p>
                  <b>Event organiser:</b> {event.creator.firstName}{" "}
                  {event.creator.lastName}
                </p>
                <div className="mt-3 card-actions">
                  <AttendButton userEmail={userEmail} eventId={event.id} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <ErrorIcon className="size-16 text-error" />
            <h2 className="font-extrabold text-4xl">
              Event invite link is not valid.
            </h2>
            <p>Please ask the event organiser for the correct link.</p>
          </>
        )}
      </div>
    </div>
  );
}
