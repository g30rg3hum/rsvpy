import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  centerHorizontally?: boolean;
}
export default function PageWrapper({ children, centerHorizontally }: Props) {
  return (
    <div
      className={clsx(
        "flex flex-1 mt-[2.5%]",
        centerHorizontally && "justify-center"
      )}
    >
      {children}
    </div>
  );
}
