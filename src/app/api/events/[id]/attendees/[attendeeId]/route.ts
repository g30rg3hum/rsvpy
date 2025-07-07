import SpaceAvailableEmail from "@/components/emails/space-available";
import { authoriseSession } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma/prisma";
import { resend } from "@/lib/resend/resend";
import { NextRequest } from "next/server";

// specific endpoint for just getting the attendee payment status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attendeeId: string }> }
) {
  const { id, attendeeId } = await params;

  // generic login authorisation check
  const authResponse = await authoriseSession();

  if (authResponse instanceof Response) {
    // not logged in authorisation.
    return authResponse;
  } else {
    // logged in but check:
    // that the user is either event creator or attendee
    const email = authResponse;

    try {
      const event = await prisma.event.findUnique({
        where: { id: id },
        include: {
          creator: true,
          attendees: {
            include: { user: true },
          },
        },
      });

      if (!event) {
        return new Response("Event not found", { status: 404 });
      }

      // check that the user is either
      if (
        event.creator.email !== email &&
        !event.attendees.some((attendee) => attendee.user.email === email)
      ) {
        return new Response("Unauthorized to view attendee", { status: 403 });
      }
    } catch (error) {
      console.error(
        "Error fetching event while trying to get attendee:",
        error
      );
      return new Response(
        "Failed to fetch event while trying to get attendee",
        {
          status: 500,
        }
      );
    }
  }

  // at this point, authorised to get attendee.

  try {
    const attendees = await prisma.eventAttendee.findMany({
      where: {
        userId: attendeeId,
        eventId: id,
        old: false, // only get most recent record.
      },
      select: {
        payment: true,
      },
    });

    // there will only be one recent record.
    const attendee = attendees[0];

    if (!attendee) {
      return new Response("Attendee not found", { status: 404 });
    }

    return new Response(JSON.stringify(attendee), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching attendee:", error);
    return new Response("Failed to fetch attendee", { status: 500 });
  }
}

// create an endpoint specifically for updating the payment status of attendee.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attendeeId: string }> }
) {
  // NOTE: attendeeId is just the userId of the attendee.
  const { id, attendeeId } = await params;

  // generic login authorisation check
  const authResponse = await authoriseSession();

  if (authResponse instanceof Response) {
    // not logged in authorisation.
    return authResponse;
  } else {
    // logged in but check:
    // that the user is either event creator or attendee
    const email = authResponse;

    try {
      const event = await prisma.event.findUnique({
        where: { id: id },
        include: {
          creator: true,
          attendees: {
            include: { user: true },
          },
        },
      });

      if (!event) {
        return new Response("Event not found", { status: 404 });
      }

      // check that the user is either
      if (
        event.creator.email !== email &&
        !event.attendees.some((attendee) => attendee.user.email === email)
      ) {
        return new Response("Unauthorized to update attendee", { status: 403 });
      }
    } catch (error) {
      console.error(
        "Error fetching event while trying to update attendee:",
        error
      );
      return new Response(
        "Failed to fetch event while trying to update attendee",
        {
          status: 500,
        }
      );
    }
  }

  // at this point, authorised to update attendee.

  // get the request body

  // check that there is a request body
  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response("Invalid request body", { status: 400 });
  }

  // check that the body has the payment field
  const { payment, actualEventAttendeeId } = body;
  if (!payment) {
    return new Response("Missing required fields in request body", {
      status: 400,
    });
  }

  // actualEventAttendeeId is specified if we want to just update the specific event attendee record rather than the most recent one.

  // check that payment is a valid value
  if (["PENDING", "TRANSFERRED", "CASH"].includes(payment) === false) {
    return new Response("Invalid payment value", { status: 400 });
  }

  // now can update the attendee's payment status
  try {
    let updatedAttendee;
    if (actualEventAttendeeId) {
      updatedAttendee = await prisma.eventAttendee.update({
        where: {
          id: actualEventAttendeeId,
        },
        data: {
          payment: payment,
        },
      });

      // will throw an error if record is not found.

      return new Response("Attendee payment status updated successfully", {
        status: 200,
      });
    } else {
      updatedAttendee = await prisma.eventAttendee.updateMany({
        where: {
          userId: attendeeId,
          eventId: id,
          old: false, // only update the most recent record.
        },
        data: {
          payment: payment,
        },
      });

      if (updatedAttendee.count > 0) {
        return new Response("Attendee payment status updated successfully", {
          status: 200,
        });
      } else {
        return new Response("Failed to update attendee payment status", {
          status: 404,
        });
      }
    }
  } catch (error) {
    console.error("Error updating attendee payment status:", error);
    return new Response("Failed to update attendee payment status", {
      status: 500,
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attendeeId: string }> }
) {
  const { id, attendeeId } = await params;

  // generic login authorisation check
  const authResponse = await authoriseSession();

  // unauthorised response
  if (authResponse instanceof Response) {
    return authResponse;
  } else {
    // check that user is the event creator
    const email = authResponse;

    try {
      const event = await prisma.event.findUnique({
        where: { id: id },
        include: { creator: true, attendees: { include: { user: true } } },
      });

      if (!event) {
        return new Response("Event not found", { status: 404 });
      }

      // check if user is the event creator OR attendee
      if (
        event.creator.email !== email &&
        !event.attendees.some((attendee) => attendee.user.email === email)
      ) {
        return new Response("Unauthorized to delete attendee", { status: 403 });
      }
    } catch (error) {
      console.error(
        "Error fetching event while trying to delete attendee:",
        error
      );
      return new Response(
        "Failed to fetch event while trying to delete attendee",
        {
          status: 500,
        }
      );
    }
  }

  // authorised to delete attendee
  try {
    const { count } = await prisma.eventAttendee.deleteMany({
      where: {
        userId: attendeeId,
        eventId: id,
        old: false,
      },
    });

    if (count > 0) {
      // attendee deleted, now check if event was full before this, i.e. now no. of attendees is maxAttendees-1.
      // if so send email to all those opted for notification
      const eventWithCurrentAttendees = await prisma.event.findUnique({
        where: { id: id },
        include: {
          attendees: {
            where: { old: false },
          },
        },
      });

      // already know this event exists from above.
      if (
        eventWithCurrentAttendees!.attendees.length ===
        eventWithCurrentAttendees!.maxAttendees - 1
      ) {
        // send email
        const optIns = await prisma.eventSpaceNotification.findMany({
          where: {
            eventId: id,
          },
          select: {
            email: true,
            id: true,
          },
        });

        const totalOptIns = optIns.length;
        const eventName = eventWithCurrentAttendees!.title;

        for (const [index, optIn] of optIns.entries()) {
          const email = optIn.email;
          const currentProgress = `${index + 1}/${totalOptIns}`;

          try {
            await resend.emails.send({
              from: process.env.EMAIL_FROM || "",
              to: email,
              subject: `Space freed up for ${eventName}`,
              react: SpaceAvailableEmail({
                eventName,
                optOutUrl: `${process.env.NEXT_PUBLIC_APP_URL}/emails/notify/opt-out?id=${optIn.id}&eventName=${eventName}`,
                inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/events/${id}/invite`,
              }),
            });
          } catch (error) {
            // just send it to the console, don't return error response, this is only a side operation.
            console.error(
              `Error encountered sending space available email to ${email} (${currentProgress}): ${error}`
            );
          }
        }

        // finally sent all emails.
        console.log(
          "Successfully sent all 'space available' emails to those opted in."
        );
      }

      return new Response("Attendee deleted successfully", { status: 200 });
    } else {
      return new Response("Attendee for the event not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting attendee:", error);
    return new Response("Failed to delete attendee", { status: 500 });
  }
}
