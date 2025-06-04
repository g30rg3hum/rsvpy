import { authoriseSession } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma/prisma";
import { NextRequest } from "next/server";

export async function GET(
  Request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await authoriseSession(); // TODO: need to ensure that the user is authorised to get this event's details, use userId from session

  const { id } = await params;

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
    });

    if (!event) {
      return new Response("Event not found", { status: 404 });
    }

    return Response.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return new Response("Encountered error fetching event", { status: 500 });
  }
}
