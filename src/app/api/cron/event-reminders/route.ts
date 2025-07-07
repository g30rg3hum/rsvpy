import ReminderEmail from "@/components/emails/reminder";
import { prisma } from "@/lib/prisma/prisma";
import { resend } from "@/lib/resend/resend";

export async function GET(request: Request) {
  // ONLY ABLE TO CALL IF CRON_SECRET SET
  const authHeader = request.headers.get("Authorization");
  const isValidCron =
    authHeader === process.env.CRON_SECRET ||
    request.headers.get("x-vercel-cron") === "true";

  if (!isValidCron) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = new Date();
  try {
    // find events that are starting in the next 24 hours
    // send to current attendees and creator
    const events = await prisma.event.findMany({
      where: {
        startDateTime: {
          gte: now,
          lt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: {
        attendees: {
          where: { old: false },
          include: { user: true },
        },
        creator: true,
      },
    });

    console.log(`Found ${events.length} events starting in the next 24 hours.`);

    // send emails for each event
    let emailsSent = 0;
    for (const event of events) {
      const emails = event.attendees.map((attendee) => attendee.user.email);
      const eventName = event.title;

      for (const email of emails) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || "",
            to: email,
            subject: `Reminder that ${eventName} is starting soon!`,
            react: ReminderEmail({ eventName }),
          });
          emailsSent++;
        } catch (error) {
          console.error(
            `Error sending email to ${email} for event ${eventName}:`,
            error
          );
        }
      }
    }

    return new Response(
      `Sent ${emailsSent} reminder emails for ${events.length} events starting in the next 24 hours.`,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      `Error fetching events or sending emails for upcoming event reminders:`,
      error
    );
    return new Response(
      `Error fetching events or sending emails for upcoming event reminders`,
      { status: 500 }
    );
  }
}
