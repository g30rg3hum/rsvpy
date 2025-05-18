import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="navbar px-6 py-4">
      <div className="flex-1">
        <Link href="/" className="inline-block">
          <Image
            src="/images/logo.png"
            alt="rsvpy logo"
            width={200}
            height={0}
            className="hover:scale-105 transition-transform"
          />
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/login" className="btn btn-primary">
              Login
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
