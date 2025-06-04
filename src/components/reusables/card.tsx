import clsx from "clsx";

interface Props {
  cardClassName?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}
export default function Card({
  cardClassName,
  bodyClassName,
  children,
}: Props) {
  return (
    <div
      className={clsx(
        "card card-border bg-base-200 w-full shadow-xs border border-base-100",
        cardClassName
      )}
    >
      <div className={clsx("card-body", bodyClassName)}>{children}</div>
    </div>
  );
}
