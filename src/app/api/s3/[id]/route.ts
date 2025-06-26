import { authoriseSession } from "@/lib/auth/utils";
import { s3Client } from "@/lib/s3/utils";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";

// get user's profile picture
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const authResponse = await authoriseSession();

  // generic login authorisation check
  if (authResponse instanceof Response) {
    return authResponse;
  }

  // all pfps are publicly accessible
  const commandParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `profile-pictures/${id}`,
  };

  const command = new GetObjectCommand(commandParams);

  // try to get the pfp
  try {
    await s3Client.send(command);

    return new Response("Successfully retrieved file", { status: 200 });
  } catch (error) {
    console.error("Error retrieving file:", error);
    return new Response("Failed to retrieve file", { status: 500 });
  }
}
