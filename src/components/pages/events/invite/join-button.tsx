"use client";

import toast from "react-hot-toast";

interface Props {
  eventId: string;
  userEmail: string | null | undefined;
}
export default function JoinButton({ eventId, userEmail }: Props) {
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
      }
    }
  };

  return (
    <button className="btn btn-primary w-full" onClick={handleJoin}>
      Join
    </button>
  );
}
