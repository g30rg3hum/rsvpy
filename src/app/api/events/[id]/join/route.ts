import { authoriseSession } from "@/lib/auth/utils";
import { attendEvent, attendResult } from "@/lib/db/event";
import { NextRequest } from "next/server";

interface Params {
  params: { id: string };
}
export async function POST(req: NextRequest, { params }: Params) {
  await authoriseSession();

  const { userEmail } = await req.json();
  const { id } = await params;

  if (!userEmail)
    return new Response("Missing userEmail in request body", { status: 400 });

  const result = await attendEvent(id, userEmail);

  return new Response(JSON.stringify({ result }), {
    status: result === attendResult.SUCCESS ? 200 : 400,
    headers: { "Content-Type": "application/json" },
  });
}
