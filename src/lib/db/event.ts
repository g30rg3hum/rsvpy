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
