import { getServerSession } from "next-auth";
import authOptions from "./authOptions";

export async function authoriseSession() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new Response("Unauthorised", { status: 401 });
  }
}
