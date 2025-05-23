import { CreateEventFormData } from "@/components/pages/events/create-form";
import { prisma } from "../../../lib/prisma/prisma";
import { NextRequest } from "next/server";

type PostPayload = Omit<
  CreateEventFormData,
  "startDateTime" | "endDateTime"
> & { userEmail: string; startDateTime: string; endDateTime: string | null };
export async function POST(request: NextRequest) {
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
  }: PostPayload = await request.json();

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

  try {
    // get the userId from email
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    await prisma.event.create({
      data: {
        title: name,
        description: description,
        location: location,
        startDateTime: startDateTime, // ISO format
        endDateTime: endDateTime,
        totalPrice: totalPrice,
        currency: currency,
        maxAttendees: maxAttendees,
        creatorId: user.id,
      },
    });

    return new Response("Event created successfully", { status: 200 });
  } catch (error) {
    console.error("Error creating event:", error);

    return new Response("Encountered an error creating your event", {
      status: 500,
    });
  }
}
