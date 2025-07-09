import { checkIsPassedOrUpcomingEvent } from "../helpers/utils";
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
    include: {
      creator: true,
      attendees: { include: { user: true, event: true } },
    },
  });

  return events;
}

export async function getPurelyAttendingEventsOfUser(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!user) {
    return [];
  }

  const eventAttendeeRecords = await prisma.eventAttendee.findMany({
    where: {
      userId: user.id,
      old: false, // only get current attendances
    },
    select: {
      event: {
        include: {
          creator: true,
          attendees: { include: { user: true } },
        },
      },
    },
  });

  const events = eventAttendeeRecords.map((record) => record.event);

  // filter out events that they are creator of
  const filteredEvents = events.filter((event) => event.creatorId !== user.id);

  return filteredEvents;
}

export async function getEventById(id: string) {
  const event = await prisma.event.findUnique({
    where: {
      id: id,
    },
    include: {
      creator: true,
      attendees: { include: { user: true } },
      restarts: true,
    },
  });

  return event;
}

export const attendResult = {
  EVENT_OVER: "EVENT_OVER",
  EVENT_NOT_FOUND: "EVENT_NOT_FOUND",
  EVENT_FULL: "EVENT_FULL",
  NO_USER: "NO_USER",
  ALREADY_ATTENDING: "ALREADY_ATTENDING",
  SUCCESS: "SUCCESS",
};
export async function attendEvent(eventId: string, userEmail: string) {
  // check if event has passed
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      attendees: true,
    },
  });

  if (!event) {
    return attendResult.EVENT_NOT_FOUND; // event does not exist
  }

  const isPassedEvent = checkIsPassedOrUpcomingEvent(
    event.startDateTime,
    event.endDateTime,
    "passed"
  );

  if (isPassedEvent) {
    return attendResult.EVENT_OVER; // event has passed
  }

  if (
    event.maxAttendees <=
    event.attendees.filter((attendee) => !attendee.old).length
  ) {
    return attendResult.EVENT_FULL; // event is full
  }

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
      old: false,
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
      payment:
        event.totalPrice === 0
          ? "NA"
          : event.creatorId === user.id
            ? "TRANSFERRED"
            : "PENDING",
    },
  });

  return attendResult.SUCCESS;
}

export async function getEventAttendeeRecordOfUser(
  eventId: string,
  userEmail: string
) {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!user) {
    return null; // user does not exist
  }

  const eventAttendeeRecord = await prisma.eventAttendee.findFirst({
    where: {
      eventId: eventId,
      userId: user.id,
      old: false, // only get current attendance
    },
  });

  // might be null.
  return eventAttendeeRecord;
}

export async function getEventRestarts(eventId: string) {
  const eventRestarts = await prisma.eventRestart.findMany({
    where: {
      eventId: eventId,
    },
  });

  // might be empty.
  return eventRestarts;
}
