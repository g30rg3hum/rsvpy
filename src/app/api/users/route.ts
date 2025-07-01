import { authoriseSession } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authResponse = await authoriseSession();

  // generic login authorisation check
  if (authResponse instanceof Response) {
    return authResponse;
  }

  // get the email from query parameters.
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  // for this endpoint, email param is required.
  if (!email) {
    return new Response("Email parameter is required", { status: 400 });
  }

  // can only get this user's details if you're logged in as the user
  const userEmail = authResponse;
  if (userEmail !== email) {
    return new Response("Unauthorized to view this user's details", {
      status: 403,
    });
  }

  // get the user details from the db
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      // SELECT ONLY required fields for now
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        uploadedPfp: true,
        paymentInformation: true,
      },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response("Encountered error fetching user", { status: 500 });
  }
}
