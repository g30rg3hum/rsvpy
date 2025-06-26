import { authoriseSession } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma/prisma";
import { NextRequest } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3/utils";

async function uploadFileToS3(
  fileBuffer: Buffer,
  fileName: string,
  fileType: string
) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `profile-pictures/${fileName}`,
    Body: fileBuffer,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);

  await s3Client.send(command);

  return fileName;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authoriseSession();

  // generic login authorisation check
  if (authResponse instanceof Response) {
    return authResponse;
  }

  let formData;
  // check that there is form data payload
  try {
    formData = await request.formData();
  } catch (error) {
    console.error("Error parsing form data:", error);
    return new Response("Invalid form data", { status: 400 });
  }

  // extract form data
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const profilePicture = formData.get("profilePicture");

  if (!firstName || !lastName) {
    return new Response("Missing required fields in request body", {
      status: 400,
    });
  }

  // get id of the user
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

  // profile picture must be overwritten; must name the file with the id. IF not null.
  // now can update details, already know exists + authorised.

  try {
    // upload the pfp if it exists
    if (profilePicture && profilePicture instanceof File) {
      // check that the file is a valid image.
      if (!profilePicture.type.startsWith("image/")) {
        return new Response("Profile picture must be an image", {
          status: 400,
        });
      }

      // check that the file is not too large (at most 1MB)
      if (profilePicture.size > 1024 * 1024) {
        return new Response("Profile picture must be at most 1MB", {
          status: 400,
        });
      }

      const buffer = Buffer.from(await profilePicture.arrayBuffer());
      await uploadFileToS3(buffer, `${id}`, profilePicture.type);
    }

    // update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName: firstName.toString(),
        lastName: lastName.toString(),
      },
      select: {
        id: true,
      },
    });

    // no need to store profile picture url, can be retrieved using the user's id.

    return Response.json(updatedUser.id);
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response("Encountered error updating user", { status: 500 });
  }
}
