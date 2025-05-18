import { trimAndCapitalize } from "@/lib/helpers/utils";
import { prisma } from "@/lib/prisma/prisma";
import { User } from "@prisma/client";

export async function POST(request: Request) {
  const { email, firstName, lastName } = await request.json();

  const missingFields = !email || !firstName || !lastName;
  if (missingFields) {
    return new Response("Missing email or password", { status: 400 });
  }

  // keep validation in the FE, but sanitize firstName and lastName
  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedFirstName = trimAndCapitalize(firstName);
  const sanitizedLastName = trimAndCapitalize(lastName);

  try {
    // Assuming you have a function to create a user
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
      },
    });

    return new Response(user.id, { status: 201 });
  } catch (error) {
    return new Response("Error creating user in the back-end", {
      status: 500,
    });
  }
}
