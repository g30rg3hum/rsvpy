"use client";

import { redirect, usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  eventId: string;
  userEmail: string | null | undefined;
}
export default function AttendButton({ eventId, userEmail }: Props) {
  const pathname = usePathname();

  const handleAttend = async () => {
    if (!userEmail) {
      toast.error("You must be signed in to attend an event.");
      redirect(`/login?callbackUrl=${pathname}`);
    }

    const res = await fetch(`/api/events/attend/${eventId}`, {
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
      toast.error("You are already attending this event.");
    }
  };

  return (
    <button className="btn btn-primary w-full" onClick={handleAttend}>
      Attend
    </button>
  );
}
