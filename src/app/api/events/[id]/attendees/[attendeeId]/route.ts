import { authoriseSession } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma/prisma";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attendeeId: string }> }
) {
  const { id, attendeeId } = await params;

  // generic login authorisation check
  const authResponse = await authoriseSession();

  // unauthorised response
  if (authResponse instanceof Response) {
    return authResponse;
  } else {
    // check that user is the event creator
    const email = authResponse;

    try {
      const event = await prisma.event.findUnique({
        where: { id: id },
        include: { creator: true },
      });

      if (!event) {
        return new Response("Event not found", { status: 404 });
      }

      // check if user is the event creator
      if (event.creator.email !== email) {
        return new Response("Unauthorized to delete attendee", { status: 403 });
      }
    } catch (error) {
      console.error(
        "Error fetching event while trying to delete attendee:",
        error
      );
      return new Response(
        "Failed to fetch event while trying to delete attendee",
        {
          status: 500,
        }
      );
    }
  }

  // authorised to delete attendee
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
