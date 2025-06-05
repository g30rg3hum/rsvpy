import { authoriseSession } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma/prisma";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attendeeId: string }> }
) {
  await authoriseSession();

  const { id, attendeeId } = await params;

  try {
    const { count } = await prisma.eventAttendee.deleteMany({
      where: {
        userId: attendeeId,
        eventId: id,
      },
    });

    if (count > 0)
      return new Response("Attendee deleted successfully", { status: 200 });
    else
      return new Response("Attendee for the event not found", { status: 404 });
  } catch (error) {
    console.error("Error deleting attendee:", error);
    return new Response("Failed to delete attendee", { status: 500 });
  }
}
