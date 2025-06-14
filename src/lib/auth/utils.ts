import { getServerSession } from "next-auth";
import authOptions from "./authOptions";
import { redirect } from "next/navigation";

export async function authoriseSession() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new Response("Unauthorised", { status: 401 });
  } else {
    return session.user.email;
  }
}

export async function getSessionThenEmail(pathname?: string) {
  const session = await getServerSession(authOptions);

  const userEmail = session?.user?.email;
  if (!userEmail) {
    // i.e. not signed in.
    if (pathname) {
      // if pathname is provided, redirect to login with callback URL
      return redirect(`/login?callbackUrl=${pathname}`);
    } else {
      return redirect("/login");
    }
  }

  return userEmail;
}
