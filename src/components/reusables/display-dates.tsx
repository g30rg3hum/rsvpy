"use client";

import { useEffect, useState } from "react";

interface Props {
  startDateTime: Date;
  endDateTime?: Date | null;
}

export const dateDisplayOptions: Intl.DateTimeFormatOptions = {
  timeStyle: "short",
  dateStyle: "short",
};

export default function DisplayStartAndEndDates({
  startDateTime,
  endDateTime,
}: Props) {
  // hydration error workaround
  const [localStartDateTime, setLocalStartDateTime] = useState<string>();
  const [localEndDateTime, setLocalEndDateTime] = useState<
    string | undefined
  >();

  useEffect(() => {
    setLocalStartDateTime(
      startDateTime.toLocaleString(undefined, dateDisplayOptions)
    );
    if (endDateTime) {
      setLocalEndDateTime(
        endDateTime.toLocaleString(undefined, dateDisplayOptions)
      );
    }
  });

  return (
    <p>
      <b>Dates/times:</b> {localStartDateTime}
      {endDateTime && " - " + localEndDateTime}
    </p>
  );
}
