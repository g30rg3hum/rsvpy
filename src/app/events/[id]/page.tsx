import PageWrapper from "@/components/layout/page-wrapper";
import Card from "@/components/reusables/card";
import { getSessionThenEmail } from "@/lib/auth/utils";
import { getEventById } from "@/lib/db/event";
import {
  BanknotesIcon,
  CheckCircleIcon,
  HashtagIcon,
  InformationCircleIcon,
  PencilIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { formatInTimeZone } from "date-fns-tz";

interface Props {
  params: {
    id: string;
  };
}
export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const userEmail = await getSessionThenEmail("/events");

  // check if event exists
  const event = await getEventById(id);
  if (!event) {
    throw new Error("Event not found");
  }

  // check if user is the creator of the event
  if (event.creator.email !== userEmail) {
    throw new Error("Not authorised to view this event");
  }

  return (
    <PageWrapper centerHorizontally>
      <div className="flex flex-col w-full items-center px-8 pb-8 border border-red-500">
        <div className="w-full max-w-[900px] space-y-8">
          <div className="text-center h-max">
            <h2 className="font-black text-3xl">{event.title}</h2>
          </div>
          <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-4 border border-red-500">
            <Card cardClassName="relative">
              <h2 className="card-title font-bold">
                <InformationCircleIcon className="size-8" /> Event details
              </h2>
              <p>
                <b>Description:</b> {event.description}
              </p>
              <p>
                <b>Location:</b> {event.location}
              </p>
              <p>
                <b>Dates:</b>{" "}
                {formatInTimeZone(
                  event.startDateTime,
                  "UTC",
                  "dd/MM/yyyy (HH:mm)"
                )}
                {event.endDateTime &&
                  " - " +
                    formatInTimeZone(
                      event.endDateTime,
                      "UTC",
                      "dd/MM/yyyy (HH:mm)"
                    )}
              </p>
              <p>
                <b>Price: </b> {event.currency} {event.totalPrice}
              </p>
              <p>
                <b>Maximum # of attendees: </b> {event.maxAttendees}
              </p>
              <button className="btn btn-primary btn-circle btn-sm btn-icon absolute top-3 right-3">
                <PencilIcon className="size-3" />
              </button>
            </Card>
            <div className="grid gap-4 grid-cols-1">
              <Card bodyClassName="flex flex-col items-center items-center">
                <h2 className="card-title font-bold">
                  <HashtagIcon className="size-5" /> Attendee count
                </h2>
                <p className="font-black text-2xl">50 / 60</p>
              </Card>
              <Card bodyClassName="flex flex-col items-center items-center">
                <h2 className="card-title font-bold">
                  <HashtagIcon className="size-5" /> Payment count
                </h2>
                <p className="font-black text-2xl">50 / 60</p>
              </Card>
            </div>
          </div>
          <Card>
            <h2 className="card-title font-bold">
              <UserGroupIcon className="size-7" /> Attendees
            </h2>
            {/* person's name, email, payment status, kick */}
            <div className="overflow-x-auto">
              <table className="table relative">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Paid?</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>George Hum</td>
                    <td>hmw.geo@gmail.com</td>
                    <td>
                      <CheckCircleIcon className="size-5" />
                    </td>
                    <td className="text-right">
                      <button className="btn btn-sm btn-error">Kick</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button className="btn btn-sm btn-primary right-4 top-4 absolute">
                Invite
              </button>
            </div>
          </Card>
          <Card>
            <h2 className="card-title font-bold">
              <BanknotesIcon className="size-7" /> Payments
            </h2>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
