import { attendEvent } from "@/lib/db/event";
import { NextRequest } from "next/server";

interface Params {
  params: { eventId: string };
}
export async function POST(req: NextRequest, { params }: Params) {
  const { userEmail } = await req.json();
  const { eventId } = await params;

  if (!userEmail)
    return new Response("Missing userEmail in request body", { status: 400 });

  const success = await attendEvent(eventId, userEmail);

  return new Response(JSON.stringify({ success }), {
    status: success ? 200 : 400,
  });
}
