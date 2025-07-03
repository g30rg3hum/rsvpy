"use client";

import { LinkIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

interface Props {
  baseUrl: string;
  eventId: string;
}
export default function InviteButton({ baseUrl, eventId }: Props) {
  return (
    <button
      className="btn btn-sm btn-primary transition-all btn-circle"
      onClick={() => {
        navigator.clipboard.writeText(`${baseUrl}/events/${eventId}/invite`);

        toast.success("Invite link copied to clipboard!");
      }}
    >
      <span>
        <LinkIcon className="size-3" />
      </span>
      <span className="hidden">Copy invite link</span>
    </button>
  );
}
