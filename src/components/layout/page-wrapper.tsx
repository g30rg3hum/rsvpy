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
        "flex flex-1",
        centerHorizontally && "justify-center",
        topMargin && "mt-[2.5%]"
      )}
    >
      {children}
    </div>
  );
}
