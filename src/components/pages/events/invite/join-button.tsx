"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  eventId: string;
  userEmail: string | null | undefined;
}
export default function JoinButton({ eventId, userEmail }: Props) {
  const router = useRouter();

  const handleJoin = async () => {
    if (!userEmail) {
      toast.error("Please sign in first to join the event.");
    }

    const res = await fetch(`/api/events/${eventId}/join`, {
      method: "POST",
      body: JSON.stringify({
        userEmail,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      toast.success("You are now attending this event!");
    } else {
      const body = await res.json();
      if (body.result === "NO_USER") {
        toast.error("You need to sign in to join the event.");
      } else if (body.result === "ALREADY_ATTENDING") {
        toast.error("You are already attending this event.");
      } else if (body.result === "EVENT_NOT_FOUND") {
        toast.error("This event does not exist. Please contact the organiser.");
      } else if (body.result === "EVENT_OVER") {
        toast.error("This event has already passed.");
      } else if (body.result === "EVENT_FULL") {
        toast.error("This event is already full.");
      }
    }

    router.refresh();
  };

  return (
    <button className="btn btn-primary w-full" onClick={handleJoin}>
      Join
    </button>
  );
}
