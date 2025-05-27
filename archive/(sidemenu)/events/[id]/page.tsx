import Card from "@/components/reusables/card";
import { getSessionThenEmail } from "@/lib/auth/utils";
import { getEventById } from "@/lib/db/event";
import { formatDateTime } from "@/lib/helpers/utils";

interface Props {
  params: { id: string };
}
export default async function EventPage({ params }: Props) {
  const userEmail = await getSessionThenEmail("/events");

  const { id } = params;
  // get the event info
  const event = await getEventById(id);

  if (!event) {
    throw new Error("Event not found");
  }

  return (
    <div className=" p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">{event.title}</h1>
          <p className="text-sm text-gray-500">
            Times: {formatDateTime(event.startDateTime)}{" "}
            {event.endDateTime && `- ${formatDateTime(event.endDateTime)}`}
          </p>
          <p className="text-sm text-gray-500">Located at: {event.location}</p>
          <p className="text-sm text-gray-500">
            Event price: {event.currency} {event.totalPrice}
          </p>
        </div>
        <div className="space-x-2 self-start">
          <button className="btn btn-md btn-outline">Edit</button>
          <button className="btn btn-md btn-error">Delete</button>
        </div>
      </div>

      <div className="flex gap-4">
        <Card cardClassName="w-1/2" bodyClassName="flex flex-col items-center">
          <h2 className="font-extrabold text-lg">Attendees count</h2>
          <p className="font-bold text-3xl">36/40</p>
        </Card>
        <Card cardClassName="w-1/2" bodyClassName="flex flex-col items-center">
          <h2 className="font-extrabold text-lg">Payments completed</h2>
          <p className="font-bold text-3xl">10/36</p>
        </Card>
      </div>

      {/* Attendees */}
      {/* <div className="bg-base-100 p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-4">Attendees</h2>
        <ul className="space-y-2">
          <li
            key={1}
            className="flex justify-between items-center border-b pb-2"
          >
            <span>Email</span>
            <span className={`badge`}>payment status</span>
          </li>
        </ul>
      </div> */}

      {/* Invite / Share */}
      {/* <div className="bg-base-100 p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-2">Invite others</h2>
        <div className="flex items-center gap-2">
          <input className="input input-bordered flex-1" />
          <button className="btn btn-primary btn-sm">Copy</button>
        </div>
      </div> */}
    </div>
  );
}
