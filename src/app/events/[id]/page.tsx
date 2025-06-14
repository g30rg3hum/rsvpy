import PageWrapper from "@/components/layout/page-wrapper";
import InviteButton from "@/components/pages/events/invite/invite-button";
import DeleteButton from "@/components/pages/events/update/delete-button";
import EditButton from "@/components/pages/events/update/edit-button";
import KickButton from "@/components/pages/events/update/kick-button";
import Card from "@/components/reusables/card";
import DisplayStartAndEndDates from "@/components/reusables/display-dates";
import { getSessionThenEmail } from "@/lib/auth/utils";
import { getEventById } from "@/lib/db/event";
import { checkIsPassedOrUpcomingEvent } from "@/lib/helpers/utils";
import {
  BanknotesIcon,
  CheckCircleIcon,
  HashtagIcon,
  InformationCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { headers } from "next/headers";

interface Props {
  params: Promise<{ id: string }>;
}
export default async function EventPage({ params }: Props) {
  // get the base URL from headers
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}`;

  const { id } = await params;
  const userEmail = await getSessionThenEmail("/events");

  // check if event exists
  const event = await getEventById(id);
  if (!event) {
    throw new Error("Event not found");
  }

  // check if user is the creator or attendee of event
  const isCreator = event.creator.email === userEmail;
  const isAttendee = event.attendees.some(
    (attendee) => attendee.user.email === userEmail
  );
  const isJustAttendee = isAttendee && !isCreator;

  if (!isCreator && !isAttendee) {
    throw new Error("Not authorised to view this event");
  }

  const isPassedEvent = checkIsPassedOrUpcomingEvent(
    event.startDateTime,
    event.endDateTime,
    "passed"
  );

  return (
    <PageWrapper centerHorizontally>
      <div className="flex flex-col w-full items-center px-8 pb-8">
        <div className="w-full max-w-[900px] space-y-8">
          <div className="text-center h-max break-all">
            <h2 className="font-black text-3xl">{event.title}</h2>
          </div>
          <div
            className={clsx(
              `grid grid-cols-1 w-full`,
              isCreator && "md:grid-cols-2 gap-8 md:gap-4"
            )}
          >
            <Card cardClassName="relative">
              <h2 className="card-title font-bold">
                <InformationCircleIcon className="size-8" /> Event details
              </h2>
              {isPassedEvent && (
                <p className="italic">(This event has passed)</p>
              )}
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
                <b>Price: </b> {event.currency} {event.totalPrice}
              </p>
              <p>
                <b>Maximum # of attendees: </b> {event.maxAttendees}
              </p>
              {isCreator && (
                <div className="absolute top-3 right-3 flex gap-2">
                  <DeleteButton eventId={id} />
                  <EditButton
                    isPassedEvent={isPassedEvent}
                    eventId={event.id}
                  />
                </div>
              )}
            </Card>
            <div className="grid gap-8 md:gap-4 grid-cols-1">
              {isCreator && (
                <>
                  <Card bodyClassName="flex flex-col items-center items-center">
                    <h2 className="card-title font-bold">
                      <HashtagIcon className="size-5" /> Attendee count
                    </h2>
                    <p className="font-black text-2xl">
                      {event.attendees.length} / {event.maxAttendees}
                    </p>
                  </Card>
                  <Card bodyClassName="flex flex-col items-center items-center">
                    <h2 className="card-title font-bold">
                      <HashtagIcon className="size-5" /> Payment count
                    </h2>
                    <p className="font-black text-2xl">- / -</p>
                  </Card>
                </>
              )}
            </div>
          </div>
          <Card>
            <h2 className="card-title font-bold">
              <UserGroupIcon className="size-7" /> Attendees{" "}
              {isJustAttendee &&
                `(${event.attendees.length} / ${event.maxAttendees})`}
            </h2>
            {/* person's name, email, payment status, kick */}
            <div className="overflow-x-auto">
              <table className="table relative">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    {isCreator && (
                      <>
                        <th>Paid?</th>
                        <th></th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {event.attendees.map((attendee, index) => (
                    <tr key={attendee.id}>
                      <td>{index + 1}</td>
                      <td>
                        {attendee.user.firstName} {attendee.user.lastName}
                      </td>
                      <td>{attendee.user.email}</td>
                      {isCreator && (
                        <>
                          <td>
                            <CheckCircleIcon className="size-5" />
                          </td>
                          <td className="text-right">
                            <KickButton
                              attendeeId={attendee.userId}
                              eventId={event.id}
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {isCreator && (
                <div className="right-4 top-4 absolute">
                  <InviteButton baseUrl={baseUrl} eventId={event.id} />
                </div>
              )}
            </div>
          </Card>
          {isCreator && (
            <Card>
              <h2 className="card-title font-bold">
                <BanknotesIcon className="size-7" /> Payments
              </h2>
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
