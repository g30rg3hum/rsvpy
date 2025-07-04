import InviteEmail from "@/components/emails/invite";
import { authoriseSession } from "@/lib/auth/utils";
import { resend } from "@/lib/resend/resend";

interface PostPayload {
  emails: string[];
  organiserName: string;
  eventName: string;
  eventId: string;
}
export async function POST(request: Request) {
  const authResponse = await authoriseSession();

  // has to be at least logged in
  if (authResponse instanceof Response) {
    return authResponse;
  }

  let payload: PostPayload;

  try {
    // payload must exist
    payload = await request.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response("Invalid JSON in request body", { status: 400 });
  }

  const { emails, organiserName, eventName, eventId } = payload;

  if (
    !emails ||
    emails.length === 0 ||
    !organiserName ||
    !eventName ||
    !eventId
  ) {
    return new Response("Missing required fields in request body", {
      status: 400,
    });
  }

  const totalEmails = emails.length;

  for (const [index, email] of emails.entries()) {
    const currentProgress = `${index + 1}/${totalEmails}`;

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "",
        to: email,
        subject: `Invitation to ${eventName}`,
        react: InviteEmail({
          organiserName,
          eventName,
          inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}/invite`,
        }),
      });
    } catch (error) {
      console.error(
        `Error encountered sending email (${currentProgress}) to ${email}: ${error}`
      );
      return new Response(
        `Error encountered sending email (${currentProgress}) to ${email}`,
        { status: 500 }
      );
    }
  }

  return new Response(
    `Successfully sent invitation emails to all ${totalEmails} individual(s).`,
    { status: 200 }
  );
}
