import { UserDetailsFormData } from "@/components/pages/profile/user-details-form";
import { authoriseSession } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma/prisma";
import { NextRequest } from "next/server";

type PutPayload = UserDetailsFormData;
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authoriseSession();

  // generic login authorisation check
  if (authResponse instanceof Response) {
    return authResponse;
  }

  // check that there is a request payload
  let payload: PutPayload;
  try {
    payload = await request.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response("Invalid request body", { status: 400 });
  }

  // extract data from the payload.
  const { firstName, lastName }: PutPayload = payload;

  if (!firstName || !lastName) {
    return new Response("Missing required fields in request body", {
      status: 400,
    });
  }

  // get the id of the user.
  const { id } = await params;

  // only the user can update their own details
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        email: true,
      },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // check that the logged in user is the same as the user being updated
    const userEmail = authResponse;
    if (user.email !== userEmail) {
      return new Response("Unauthorized to update this user's details", {
        status: 403,
      });
    }
  } catch (error) {
    console.error("Error fetching user while trying to update:", error);
    return new Response(
      "Encountered error fetching user while trying to update",
      { status: 500 }
    );
  }

  // now we can update the user's details
  try {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        firstName: firstName,
        lastName: lastName,
      },
      select: {
        id: true,
      },
    });

    return Response.json(updatedUser.id);
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response("Encountered error updating user", { status: 500 });
  }
}
