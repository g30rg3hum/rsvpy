import Card from "@/components/reusables/card";
import { formatInTimeZone } from "date-fns-tz";
import { Event } from "@/lib/db/types";

interface Props {
  event: Event;
}
export default function EventItem({ event }: Props) {
  return (
    <Card>
      <h2 className="card-title font-bold">{event.title}</h2>
      <p className="text-gray-600">{event.description}</p>
      <p>
        <b>Location:</b> {event.location}
      </p>
      <p>
        <b>Dates:</b>{" "}
        {formatInTimeZone(event.startDateTime, "UTC", "dd/MM/yyyy (HH:mm)")}
        {event.endDateTime &&
          " - " +
            formatInTimeZone(event.endDateTime, "UTC", "dd/MM/yyyy (HH:mm)")}
      </p>
      <div className="justify-end card-actions">
        <button className="btn btn-primary">Manage</button>
      </div>
    </Card>
  );
}
