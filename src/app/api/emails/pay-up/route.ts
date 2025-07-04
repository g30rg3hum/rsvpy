import { authoriseSession } from "@/lib/auth/utils";
import { Props as PostPayload } from "@/components/emails/actions/pay-up-button";
import { resend } from "@/lib/resend/resend";
import PayUpEmail from "@/components/emails/pay-up";

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

  const { attendeesPendingPayment, eventName, organiserName } = payload;

  if (!attendeesPendingPayment || !eventName || !organiserName)
    return new Response("Missing required fields in request body", {
      status: 400,
    });

  const totalEmails = attendeesPendingPayment.length;

  // now can send the email
  for (const [index, attendee] of attendeesPendingPayment.entries()) {
    const currentProgress = `${index + 1}/${totalEmails}`;

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "",
        to: attendee.email,
        subject: "Payment request for " + eventName,
        react: PayUpEmail({
          organiserName,
          eventName,
          recipientName: attendee.name,
        }),
      });
    } catch (error) {
      console.error(
        `Error encountered sending email (${currentProgress}) to ${attendee.email}: ${error}`
      );
      return new Response(
        `Error encountered sending email (${currentProgress}) to ${attendee.email}`,
        { status: 500 }
      );
    }
  }

  return new Response(
    `Successfully sent payment request emails to all ${totalEmails} attendees pending payment.`,
    { status: 200 }
  );
}
