import { prisma } from "../prisma/prisma";

export async function getEventsOfUser(userEmail: string) {
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
    },
  });

  return event;
}

export async function attendEvent(eventId: string, userEmail: string) {
  // get the userId from email
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!user) {
    return false;
  }

  // check if the user is already attending the event
  const existingAttendance = await prisma.eventAttendee.findFirst({
    where: {
      eventId: eventId,
      userId: user.id,
    },
  });

  if (existingAttendance) {
    return false; // already attending
  }

  // create a new attendance record
  await prisma.eventAttendee.create({
    data: {
      eventId: eventId,
      userId: user.id,
      rsvpStatus: "ACCEPTED",
    },
  });

  return true;
}
