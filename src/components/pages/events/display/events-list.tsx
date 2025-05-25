import { getEventsOfUser } from "@/lib/db/event";
import EventItem from "./event-item";

interface Props {
  userEmail: string;
}
export default async function EventsList({ userEmail }: Props) {
  const events = await getEventsOfUser(userEmail);

  return (
    <div className="flex gap-6 flex-wrap justify-center">
      {events.map((ev, index) => (
        <EventItem
          key={index}
          name={ev.title}
          description={ev.description}
          location={ev.location}
          startTime={ev.startDateTime}
          endTime={ev.endDateTime}
        />
      ))}
    </div>
  );
}
