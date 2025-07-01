import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  centerHorizontally?: boolean;
  topMargin?: boolean;
}
export default function PageWrapper({
  children,
  centerHorizontally,
  topMargin = true,
}: Props) {
  return (
    <div
      className={clsx(
        "h-full flex flex-col justify-start flex-grow w-full",
        centerHorizontally && "items-center",
        topMargin && "mt-[2.5%]"
      )}
    >
      {children}
    </div>
  );
}
