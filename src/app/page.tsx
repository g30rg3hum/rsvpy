import authOptions from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const userEmail = session?.user?.email;

  if (userEmail) {
    // User is already logged in, redirect to events page
    return redirect("/events");
  }

  return <div></div>;
}
