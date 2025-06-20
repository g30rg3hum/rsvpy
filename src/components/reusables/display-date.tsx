"use client";

import { useEffect, useState } from "react";
import { dateDisplayOptions } from "./display-dates";

interface Props {
  date: Date;
}
export default function DisplayDate({ date }: Props) {
  const [localDate, setLocalDate] = useState<string>();

  useEffect(() => {
    setLocalDate(date.toLocaleString(undefined, dateDisplayOptions));
  });

  return <span>{localDate}</span>;
}
