/* eslint-disable @next/next/no-img-element */
import authOptions from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import SignOut from "../authentication/sign-out";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email; // defined if logged in.

  return (
    <div className="navbar px-6 py-4">
      <div className="flex-1">
        <Link href="/" className="inline-block">
          <Image
            src="/images/logo.png"
            alt="rsvpy logo"
            width={188}
            height={0}
            className="hover:scale-105 transition-transform"
          />
        </Link>
      </div>
      <div>
        <ul className="menu menu-horizontal flex items-center gap-2 p-0 ">
          {email ? (
            <>
              <li className="font-semibold">
                <Link href="/events">Events</Link>
              </li>
              <li className="font-semibold">
                <Link href="#">Payments</Link>
              </li>
              <div className="dropdown dropdown-end font-semibold">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full border border-base-300">
                    <img
                      src="/images/portrait.png"
                      alt="User profile picture"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-md dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow-xs"
                >
                  <li>
                    <a href="#">Profile</a>
                  </li>
                  <li>
                    <SignOut />
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <li>
              <Link href="/login" className="btn btn-primary">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
