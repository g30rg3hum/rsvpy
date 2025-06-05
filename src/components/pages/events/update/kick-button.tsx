"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  eventId: string;
  attendeeId: string;
}
export default function KickButton({ eventId, attendeeId }: Props) {
  const router = useRouter();

  const handleKick = async () => {
    try {
      const res = await fetch(
        `/api/events/${eventId}/attendees/${attendeeId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toast.success("Attendee kicked successfully.");
        router.refresh();
      } else {
        toast.error("Failed to kick attendee.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to kick attendee.");
    }
  };

  return (
    <button className="btn btn-sm btn-error" onClick={handleKick}>
      Kick
    </button>
  );
}
