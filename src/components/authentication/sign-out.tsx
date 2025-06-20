"use client";

import { signOut } from "next-auth/react";

interface Props {
  type: "button" | "link";
}
export default function SignOut({ type }: Props) {
  if (type === "link") {
    return (
      <a href="#" onClick={() => signOut({ callbackUrl: "/" })}>
        Sign out
      </a>
    );
  } else {
    return (
      <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
    );
  }
}
