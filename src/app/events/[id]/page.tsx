import PageWrapper from "@/components/layout/page-wrapper";
import ManageAttendeesList from "@/components/pages/events/attendees/manage-attendees-list";
import PaymentForm from "@/components/pages/events/show/payment-form";
import DeleteButton from "@/components/pages/events/update/delete-button";
import EditButton from "@/components/pages/events/update/edit-button";
import LeaveButton from "@/components/pages/events/update/leave-button";
import Card from "@/components/reusables/card";
import DisplayStartAndEndDates from "@/components/reusables/display-dates";
import { getSessionThenEmail } from "@/lib/auth/utils";
import { getEventAttendeeRecordOfUser, getEventById } from "@/lib/db/event";
import {
  checkIsPassedOrUpcomingEvent,
  roundToTwoDp,
} from "@/lib/helpers/utils";
import {
  BanknotesIcon,
  // BanknotesIcon,
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
    (attendee) => attendee.user.email === userEmail && !attendee.old
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

  const numberOfAttendees = event.attendees.filter(
    (attendee) => !attendee.old
  ).length;

  let paid, attendeeId;
  if (isJustAttendee) {
    const attendeeRecord = await getEventAttendeeRecordOfUser(
      event.id,
      userEmail
    );
    paid = !(attendeeRecord?.payment === "PENDING");
    attendeeId = attendeeRecord?.userId;
  }

  let totalNoPaid = event.attendees.reduce((acc, attendee) => {
    if (attendee.payment !== "PENDING" && !attendee.old) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);

  // if the creator is attending, automatically count as paid
  if (
    event.attendees.some(
      (attendee) => attendee.user.email === event.creator.email && !attendee.old
    )
  ) {
    totalNoPaid += 1;
  }

  return (
    <PageWrapper centerHorizontally>
      <div className="flex flex-col w-full items-center px-8 pb-8">
        <div className="w-full max-w-[900px] space-y-8">
          <div className="text-center h-max break-all">
            <h2 className="font-black text-3xl">{event.title}</h2>
          </div>
          <div
            className={clsx(
              `grid grid-cols-1 w-full md:grid-cols-2 gap-8 md:gap-4`
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
                <b>Expected price per person:</b> {event.currency}{" "}
                {roundToTwoDp(event.totalPrice / event.maxAttendees)}
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
              {isJustAttendee && (
                <div className="absolute top-3 right-3 flex gap-2">
                  <LeaveButton eventId={event.id} attendeeId={attendeeId!} />
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
                      {numberOfAttendees} / {event.maxAttendees}
                    </p>
                  </Card>
                  <Card bodyClassName="flex flex-col items-center items-center">
                    <h2 className="card-title font-bold">
                      <HashtagIcon className="size-5" /> Payment count
                    </h2>
                    <p className="font-black text-2xl">
                      {totalNoPaid} / {numberOfAttendees}{" "}
                    </p>
                  </Card>
                </>
              )}
              {isJustAttendee && (
                <Card>
                  <h2 className="card-title font-bold">
                    <BanknotesIcon className="size-7" />
                    <span className="mr-2">Payment status</span>
                    {paid ? (
                      <div className="badge badge-success">Paid</div>
                    ) : (
                      <div className="badge badge-error">Unpaid</div>
                    )}
                  </h2>
                  <PaymentForm
                    paid={paid!}
                    eventId={event.id}
                    attendeeId={attendeeId!}
                  />
                  <p className="font-bold mt-2">Overall payment progress</p>
                  <progress
                    className="progress progress-success w-full"
                    value={(totalNoPaid / numberOfAttendees) * 100}
                    max="100"
                  ></progress>
                </Card>
              )}
            </div>
          </div>
          <Card>
            <h2 className="card-title font-bold">
              <UserGroupIcon className="size-7" /> Attendees{" "}
              {isJustAttendee &&
                `(${
                  event.attendees.filter((attendee) => !attendee.old).length
                } / ${event.maxAttendees})`}
            </h2>
            {/* person's name, email, payment status, kick */}
            <ManageAttendeesList
              isCreator={isCreator}
              event={event}
              isJustAttendee={isJustAttendee}
              isPassedEvent={isPassedEvent}
              baseUrl={baseUrl}
            />
          </Card>
          {/* {isCreator && (
            <Card>
              <h2 className="card-title font-bold">
                <BanknotesIcon className="size-7" /> Payments
              </h2>
            </Card>
          )} */}
        </div>
      </div>
    </PageWrapper>
  );
}
