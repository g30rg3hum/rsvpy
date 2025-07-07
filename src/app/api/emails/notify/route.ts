import LeftOptInEmail from "@/components/emails/left-opt-in";
import { prisma } from "@/lib/prisma/prisma";
import { resend } from "@/lib/resend/resend";

interface PostPayload {
  email: string;
  eventName: string;
  eventId: string;
}
export async function POST(request: Request) {
  // don't have to be logged in to join mailing list.

  // first check that payload is valid/exists
  let payload: PostPayload;
  try {
    payload = await request.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response("Invalid JSON in request body.", { status: 400 });
  }

  const { email, eventName, eventId } = payload;

  if (!email || !eventName || !eventId) {
    return new Response("Missing required fields in request body.", {
      status: 400,
    });
  }

  // check that not already in mailing list
  try {
    const record = await prisma.eventSpaceNotification.findFirst({
      where: {
        email,
        eventId,
      },
    });

    if (record) {
      return new Response(
        `${email} is already in the mailing list for this event.`,
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(`Error checking if email is in the mailing list: ${error}`);
    return new Response(`Error checking if email is in the mailing list.`, {
      status: 500,
    });
  }

  // now add the email to the mailing list for the event.
  let recordId;
  try {
    const record = await prisma.eventSpaceNotification.create({
      data: { email, eventId },
    });

    recordId = record.id;
  } catch (error) {
    console.error("Error creating event space notification record: ", error);
    return new Response("Error signing up for mailing list in database.", {
      status: 500,
    });
  }

  // now second the email using the recordId
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "",
      to: email,
      subject: `You have joined the notification mailing list for ${eventName}.`,
      react: LeftOptInEmail({
        eventName,
        optOutUrl: `${process.env.NEXT_PUBLIC_APP_URL}/emails/notify/opt-out?id=${recordId}&eventName=${eventName}`,
      }),
    });
  } catch (error) {
    console.error(
      `Error encountered sending email to ${email} about notification signup: ${error}`
    );
    return new Response(
      `Error encountered sending email to ${email} about notification signup.`,
      {
        status: 500,
      }
    );
  }

  return new Response(`Successfully added ${email} to the mailing list.`, {
    status: 200,
  });
}
