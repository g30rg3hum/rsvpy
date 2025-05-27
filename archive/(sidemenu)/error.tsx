"use client";

import PageWrapper from "@/components/layout/page-wrapper";
import { ErrorIcon } from "react-hot-toast";

export default function LoggedInError() {
  return (
    <PageWrapper centerHorizontally>
      <div className="flex flex-col items-center gap-2">
        <ErrorIcon className="size-16 text-error" />
        <h2 className="text-xl font-bold">An error was encountered.</h2>
        <p>Please navigate to another page.</p>
      </div>
    </PageWrapper>
  );
}
