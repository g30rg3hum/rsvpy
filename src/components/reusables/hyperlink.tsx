import Link from "next/link";

interface Props {
  href: string;
  children: React.ReactNode;
}
export default function HyperLink({ href, children }: Props) {
  return (
    <Link href={href} className="text-blue-400 hover:underline">
      {children}
    </Link>
  );
}
