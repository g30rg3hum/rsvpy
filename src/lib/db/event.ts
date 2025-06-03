import { prisma } from "../prisma/prisma";

export async function getOrganisedEventsOfUser(userEmail: string) {
  // get the userId from email
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!user) {
    return [];
  }

  const events = await prisma.event.findMany({
    where: {
      creatorId: user.id,
    },
  });

  return events;
}

export async function getEventById(id: string) {
  const event = await prisma.event.findUnique({
    where: {
      id: id,
    },
    include: {
      creator: true,
      attendees: { include: { user: true } },
    },
  });

  return event;
}

export const attendResult = {
  NO_USER: "NO_USER",
  ALREADY_ATTENDING: "ALREADY_ATTENDING",
  SUCCESS: "SUCCESS",
};
export async function attendEvent(eventId: string, userEmail: string) {
  // get the userId from email
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!user) {
    return attendResult.NO_USER;
  }

  // check if the user is already attending the event
  const existingAttendance = await prisma.eventAttendee.findFirst({
    where: {
      eventId: eventId,
      userId: user.id,
    },
  });

  if (existingAttendance) {
    return attendResult.ALREADY_ATTENDING; // already attending
  }

  // create a new attendance record
  await prisma.eventAttendee.create({
    data: {
      eventId: eventId,
      userId: user.id,
      rsvpStatus: "ACCEPTED",
    },
  });

  return attendResult.SUCCESS;
}
