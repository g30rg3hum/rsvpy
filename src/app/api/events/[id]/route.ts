import { authoriseSession } from "@/lib/auth/utils";
import { EventFormData } from "@/lib/form/event-form";
import { prisma } from "@/lib/prisma/prisma";
import { NextRequest } from "next/server";

// get event details by id
export async function GET(
  Request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const authResponse = await authoriseSession();

  // generic logic authorisation check
  if (authResponse instanceof Response) {
    return authResponse;
  }

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        creator: true,
        attendees: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!event) {
      return new Response("Event not found", { status: 404 });
    }

    // check that the user is either creator or attendee
    const userEmail = authResponse;
    const isCreator = event.creator.email === userEmail;
    const isAttendee = event.attendees.some(
      (attendee) => attendee.user.email === userEmail
    );

    if (!isCreator && !isAttendee) {
      return new Response("Unauthorized to view this event", { status: 403 });
    }

    // otherwise can get this event
    return Response.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return new Response("Encountered error fetching event", { status: 500 });
  }
}

type PutPayload = Omit<EventFormData, "startDateTime" | "endDateTime"> & {
  startDateTime: string;
  endDateTime: string | null;
};
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authoriseSession();

  // generic logic authorisation check
  if (authResponse instanceof Response) {
    return authResponse;
  }

  // check that there is a request body
  let requestData: PutPayload;
  try {
    requestData = await request.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response("Invalid request body", { status: 400 });
  }

  const {
    name,
    description,
    location,
    startDateTime,
    endDateTime,
    currency,
    totalPrice,
    maxAttendees,
  }: PutPayload = requestData;

  // check that have all the required fields
  if (
    !name ||
    !description ||
    !location ||
    !startDateTime ||
    !currency ||
    totalPrice === undefined ||
    maxAttendees === undefined
  ) {
    return new Response("Missing required fields in request body", {
      status: 400,
    });
  }

  // id of event
  const { id } = await params;

  // get the event first and check that the user is creator
  try {
    const event = await prisma.event.findUnique({
      where: { id: id },
      include: { creator: true },
    });

    if (!event) {
      return new Response("Event not found", { status: 404 });
    }

    // check if user is the event creator
    const email = authResponse;
    if (event.creator.email !== email) {
      return new Response("Unauthorized to update this event", { status: 403 });
    }
  } catch (error) {
    console.error("Error fetching event while trying to update:", error);
    return new Response("Failed to fetch event while trying to update", {
      status: 500,
    });
  }

  // now authorised to update event
  try {
    const updatedEvent = await prisma.event.update({
      where: {
        id: id,
      },
      data: {
        title: name,
        description: description,
        location: location,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        totalPrice: totalPrice,
        currency: currency,
        maxAttendees: maxAttendees,
      },
    });

    return Response.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return new Response("Encountered error updating event", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authoriseSession();

  if (authResponse instanceof Response) {
    return authResponse;
  }

  const { id } = await params;

  // get the event first and check that the user is creator
  try {
    const event = await prisma.event.findUnique({
      where: { id: id },
      include: { creator: true },
    });

    if (!event) {
      return new Response("Event not found", { status: 404 });
    }

    // check if user is the event creator
    const email = authResponse;
    if (event.creator.email !== email) {
      return new Response("Unauthorized to delete this event", { status: 403 });
    }
  } catch (error) {
    console.error("Error fetching event while trying to delete:", error);
    return new Response("Failed to fetch event while trying to delete", {
      status: 500,
    });
  }

  try {
    const deletedEvent = await prisma.event.delete({
      where: {
        id: id,
      },
    });

    return Response.json(deletedEvent);
  } catch (error) {
    console.error("Error deleting event:", error);
    return new Response("Encountered error deleting event", { status: 500 });
  }
}
