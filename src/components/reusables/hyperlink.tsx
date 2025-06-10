import Link from "next/link";

interface Props {
  href: string;
  children: React.ReactNode;
}
export default function HyperLink({ href, children }: Props) {
  return (
    <Link href={href} className="text-[#6EEEFF] hover:underline">
      {children}
    </Link>
  );
}
