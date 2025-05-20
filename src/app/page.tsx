"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return <div>{session?.user?.email ?? "Not signed in"}</div>;
}
