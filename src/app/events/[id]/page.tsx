import PageWrapper from "@/components/layout/page-wrapper";
import ManageAttendeesList from "@/components/pages/events/attendees/manage-attendees-list";
import HistoryButton from "@/components/pages/events/show/history-button";
import OrganiserInfoButton from "@/components/pages/events/show/organiser-info-button";
import PaymentForm from "@/components/pages/events/show/payment-form";
import DeleteButton from "@/components/pages/events/update/delete-button";
import EditButton from "@/components/pages/events/update/edit-button";
import LeaveButton from "@/components/pages/events/update/leave-button";
import Card from "@/components/reusables/card";
import DisplayStartAndEndDates from "@/components/reusables/display-dates";
import { getSessionThenEmail } from "@/lib/auth/utils";
import {
  getEventAttendeeRecordOfUser,
  getEventById,
  getEventRestarts,
} from "@/lib/db/event";
import {
  checkIsPassedOrUpcomingEvent,
  roundToTwoDp,
} from "@/lib/helpers/utils";
import {
  BanknotesIcon,
  CheckCircleIcon,
  HashtagIcon,
  InformationCircleIcon,
  StarIcon,
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

  const eventRestarts = await getEventRestarts(id);

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

  const eventHasBegun = new Date() > event.startDateTime;

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

  const totalNoPaid = event.attendees.reduce((acc, attendee) => {
    if (attendee.payment !== "PENDING" && !attendee.old) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);

  return (
    <PageWrapper centerHorizontally>
      <div className="flex flex-col w-full items-center px-6 pb-12">
        <div className="w-full max-w-[900px] space-y-6">
          <div className="text-center h-max break-all">
            <h2 className="font-black text-3xl">{event.title}</h2>
          </div>
          <div
            className={clsx(
              `grid grid-cols-1 w-full`,
              isJustAttendee && event.totalPrice === 0
                ? "md:grid-cols-1"
                : "md:grid-cols-2 gap-6"
            )}
          >
            <Card cardClassName="relative">
              <h2 className="card-title font-bold">
                <InformationCircleIcon className="size-8" /> Event details
              </h2>
              {isPassedEvent && (
                <p className="italic font-bold">
                  <CheckCircleIcon className="size-5 inline-block mr-2" />
                  (This event is completed)
                </p>
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
                <b>Price: </b> {event.currency} {event.totalPrice.toFixed(2)}
              </p>
              <div className="flex w-max">
                <p>
                  <b>Expected price per person:</b> {event.currency}{" "}
                  {roundToTwoDp(event.totalPrice / event.maxAttendees).toFixed(
                    2
                  )}
                </p>
                {isCreator && event.totalPrice !== 0 && (
                  <div className="tooltip tooltip-left sm:tooltip-top">
                    <div className="tooltip-content w-[120px] sm:w-[200px]">
                      Set your payment information (for attendees to view) in
                      your profile
                    </div>
                    <StarIcon className="size-5 inline-block bg-primary text-black p-1 rounded-full ml-2" />
                  </div>
                )}
              </div>
              <p>
                <b>Current price per person: </b> {event.currency}{" "}
                {event.attendees.filter((attendee) => !attendee.old).length ===
                0
                  ? "0.00"
                  : (
                      event.totalPrice /
                      event.attendees.filter((attendee) => !attendee.old).length
                    ).toFixed(2)}
              </p>
              <p>
                <b>Maximum # of attendees: </b> {event.maxAttendees}
              </p>
              {isCreator && (
                <div className="absolute top-3 right-3 flex gap-2">
                  <HistoryButton event={event} eventRestarts={eventRestarts} />
                  <EditButton
                    isPassedEvent={isPassedEvent}
                    eventId={event.id}
                  />
                  <DeleteButton eventId={id} />
                </div>
              )}
              {isJustAttendee && (
                <div className="absolute top-3 right-3 flex gap-2">
                  <OrganiserInfoButton organiserUser={event.creator} />
                  {/* also check that the event has not begun */}
                  {!isPassedEvent && !eventHasBegun && (
                    <LeaveButton eventId={event.id} attendeeId={attendeeId!} />
                  )}
                </div>
              )}
            </Card>
            <div className="grid gap-6 grid-cols-1">
              {isCreator && (
                <>
                  <Card bodyClassName="flex flex-col items-center justify-center">
                    <h2 className="card-title font-bold">
                      <HashtagIcon className="size-5" /> Attendee count
                    </h2>
                    <p className="font-black text-2xl grow-0">
                      {numberOfAttendees} / {event.maxAttendees}
                    </p>
                  </Card>
                  <Card bodyClassName="flex flex-col items-center justify-center">
                    <h2 className="card-title font-bold">
                      <HashtagIcon className="size-5" /> Payment count
                    </h2>
                    <p className="font-black text-2xl grow-0">
                      {event.totalPrice === 0
                        ? "-"
                        : `${totalNoPaid} / ${numberOfAttendees}`}
                    </p>
                  </Card>
                </>
              )}
              {isJustAttendee && event.totalPrice !== 0 && (
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
