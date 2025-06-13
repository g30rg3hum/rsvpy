import { trimAndCapitalize } from "../../../lib/helpers/utils";
import { prisma } from "../../../lib/prisma/prisma";
import { NextRequest } from "next/server";

interface PostPayload {
  email: string;
  firstName: string;
  lastName: string;
}
export async function POST(request: NextRequest) {
  let payload: PostPayload;
  try {
    payload = await request.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response("Invalid JSON in request body", { status: 400 });
  }

  const { email, firstName, lastName } = payload;

  // check that have all the required fields
  if (!email || !firstName || !lastName) {
    return new Response("Missing required fields in request body", {
      status: 400,
    });
  }

  // sanitize inputs
  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedFirstName = trimAndCapitalize(firstName);
  const sanitizedLastName = trimAndCapitalize(lastName);

  // check that user doesn't already exist, query the database
  const findUser = await prisma.user.findUnique({
    where: {
      email: sanitizedEmail,
    },
  });

  // shouldn't register if the user already exists.
  if (findUser !== null) {
    return new Response("User already exists", { status: 409 });
  }

  // otherwise at this point, we can create the user
  try {
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
      },
    });

    return new Response(user.id, { status: 200 });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response("Encountered an error creating your user", {
      status: 500,
    });
  }
}
