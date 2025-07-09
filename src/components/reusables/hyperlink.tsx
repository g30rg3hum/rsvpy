import Link from "next/link";

interface Props {
  href: string;
  children: React.ReactNode;
  newTab?: boolean;
}
export default function HyperLink({ href, children, newTab }: Props) {
  return (
    <Link
      href={href}
      className="text-[#6EEEFF] hover:underline"
      target={newTab ? "_blank" : "_self"}
    >
      {children}
    </Link>
  );
}
