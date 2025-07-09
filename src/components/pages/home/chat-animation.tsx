"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

const totalTexts = 12;

export default function ChatAnimation() {
  const [textOneIndex, setTextOneIndex] = useState(0);
  const [textTwoIndex, setTextTwoIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // if at the last text, we don't want to transition, but reset interval
      if (textTwoIndex === totalTexts - 1) {
        setTextOneIndex(0);
        setTextTwoIndex(1);
        return;
      }

      setIsTransitioning(true);
      // slide the first text upwards and fade out.
      // slide the second text upwards and stay.

      setTimeout(() => {
        setTextOneIndex(textTwoIndex);
        setTextTwoIndex((prevIndex) => (prevIndex + 1) % totalTexts);
        setIsTransitioning(false);
      }, 300); // match the duration of sliding
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col gap-4 w-max h-[525px]">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((textNumber, index) => (
        <Image
          key={textNumber}
          src={`/images/message-bubbles/text${textNumber}.png`}
          alt={`Text ${textNumber}`}
          height="0"
          width="250"
          className={clsx(
            !(textOneIndex === index || textTwoIndex === index) && "hidden",
            textOneIndex === index &&
              (isTransitioning
                ? "block animate-slide-up-and-fade-out"
                : "block"),
            textTwoIndex === index &&
              (isTransitioning
                ? "block animate-slide-up"
                : "block animate-pop-up")
          )}
        />
      ))}
    </div>
  );
}
