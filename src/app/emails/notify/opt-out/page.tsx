import PageWrapper from "@/components/layout/page-wrapper";
import HyperLink from "@/components/reusables/hyperlink";
import { prisma } from "@/lib/prisma/prisma";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default async function OptOutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const id = params.id as string;
  const eventName = params.eventName;

  if (!id || !eventName) {
    return new Error("Invalid opt out link.");
  }

  // must check that record exists with the id.
  try {
    const record = await prisma.eventSpaceNotification.findUnique({
      where: { id },
    });

    if (!record) {
      return new Error("Invalid opt out link.");
    }

    // exists, then delete the record.
    await prisma.eventSpaceNotification.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting email from mailing list: ", error);
    return new Error("Error deleting email from mailing list.");
  }

  return (
    <PageWrapper centerHorizontally>
      <div className="flex flex-col items-center gap-2">
        <CheckCircleIcon className="size-8" />
        <h2 className="text-xl font-bold">
          You have successfully opted out of {eventName}&apos;s mailing list for
          empty spots.
        </h2>
        <p>
          Please navigate back to <HyperLink href="/">home</HyperLink>.
        </p>
      </div>
    </PageWrapper>
  );
}
