import PageWrapper from "@/components/layout/page-wrapper";
import Card from "@/components/reusables/card";
import authOptions from "@/lib/auth/authOptions";
import { getEventById } from "@/lib/db/event";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { getServerSession } from "next-auth";

interface Props {
  params: Promise<{ id: string }>;
}
export default async function EventInvitePage({ params }: Props) {
  const { id } = await params;

  // get the session, if doesn't exist, guide user to login
  const session = await getServerSession(authOptions);
  // still display the invite page.

  // get the event by id
  const event = await getEventById(id);
  if (!event) {
    throw new Error("Event for which the invite is for does not exist.");
  }

  return (
    <PageWrapper centerHorizontally>
      <div className="flex flex-col w-full items-center px-8 pb-8">
        <Card cardClassName="max-w-[600px]">
          <h2 className="card-title font-bold">
            <EnvelopeIcon className="size-6" /> You&apos;re invited!
          </h2>
        </Card>
      </div>
    </PageWrapper>
  );
}
