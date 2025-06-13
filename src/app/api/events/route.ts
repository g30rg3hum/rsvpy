import { CreateEventFormData } from "@/components/pages/events/create/create-form";
import { prisma } from "../../../lib/prisma/prisma";
import { NextRequest } from "next/server";
import { authoriseSession } from "@/lib/auth/utils";

type PostPayload = Omit<
  CreateEventFormData,
  "startDateTime" | "endDateTime"
> & { userEmail: string; startDateTime: string; endDateTime: string | null };
export async function POST(request: NextRequest) {
  const authResponse = await authoriseSession();

  if (authResponse instanceof Response) {
    return authResponse; // unauthorised response
  }

  let payload: PostPayload;
  try {
    payload = await request.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response("Invalid JSON in request body", { status: 400 });
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
  }: PostPayload = payload;

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

  try {
    const email = authResponse;
    // get the userId from email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const event = await prisma.event.create({
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

    return new Response(event.id, { status: 200 });
  } catch (error) {
    console.error("Error creating event:", error);
    return new Response("Encountered an error creating your event", {
      status: 500,
    });
  }
}
