import { authoriseSession } from "@/lib/auth/utils";
import { EventFormData } from "@/lib/form/event-form";
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

type PutPayload = Omit<EventFormData, "startDateTime" | "endDateTime"> & {
  userEmail: string;
  startDateTime: string;
  endDateTime: string | null;
};
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {
    name,
    description,
    location,
    startDateTime,
    endDateTime,
    currency,
    totalPrice,
    maxAttendees,
    userEmail,
  }: PutPayload = await request.json();

  await authoriseSession(); // TODO: need to ensure that the user is authorised to update this event, use userId from session

  // check that have all the required fields
  if (
    !name ||
    !description ||
    !location ||
    !startDateTime ||
    !currency ||
    totalPrice === undefined ||
    maxAttendees === undefined ||
    !userEmail
  ) {
    return new Response("Missing required fields in request body", {
      status: 400,
    });
  }

  // id of event
  const { id } = await params;

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
