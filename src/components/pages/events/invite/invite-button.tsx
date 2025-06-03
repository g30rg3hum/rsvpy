"use client";

import toast from "react-hot-toast";

interface Props {
  baseUrl: string;
  eventId: string;
}
export default function InviteButton({ baseUrl, eventId }: Props) {
  return (
    <button
      className="btn btn-sm btn-primary transition-all"
      onClick={() => {
        navigator.clipboard.writeText(`${baseUrl}/events/${eventId}/invite`);

        toast.success("Invite link copied to clipboard!");
      }}
    >
      Copy invite link
    </button>
  );
}
