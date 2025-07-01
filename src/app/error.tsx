"use client";

import PageWrapper from "@/components/layout/page-wrapper";
import HyperLink from "@/components/reusables/hyperlink";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const verificationFailure = searchParams.get("verification_failure") || false;

  return (
    <PageWrapper centerHorizontally>
      <div className="flex flex-col items-center gap-2">
        <ExclamationCircleIcon className="size-8" />
        <h2 className="text-xl font-bold">
          {verificationFailure ? (
            <>Your login link has expired.</>
          ) : (
            <>The page you&apos;re looking for was not found.</>
          )}
        </h2>
        <p>
          Please navigate back to <HyperLink href="/">home</HyperLink>.
        </p>
      </div>
    </PageWrapper>
  );
}
