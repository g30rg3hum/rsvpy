/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import authOptions from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import SignOut from "../authentication/sign-out";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email; // defined if logged in.

  return (
    <div className="navbar sm:px-6 py-4">
      <div className="flex-1">
        <Link href="/" className="inline-block">
          <Image
            src="/images/logo.png"
            alt="rsvpy logo"
            width={160}
            height={0}
            className="hover:scale-105 transition-transform"
          />
        </Link>
      </div>
      <div className="sm:hidden">
        <div className="dropdown dropdown-end font-semibold">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-primary btn-md btn-square"
          >
            <Bars3Icon className="size-5" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-md dropdown-content bg-base-200 rounded-box z-1 mt-3 w-[115px] p-2 shadow-xs"
          >
            {email ? (
              <>
                <li>
                  <a href="/events">Events</a>
                </li>
                <li>
                  <a href="/payments">Payments</a>
                </li>
                <li>
                  <a href="/profile">Profile</a>
                </li>
                <li>
                  <SignOut type="link" />
                </li>
              </>
            ) : (
              <li>
                <a href="/login">Login</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="hidden sm:block">
        <ul className="flex items-center gap-10 p-0 ">
          {email ? (
            <>
              <MenuLink href="/events" text="Events" />
              <MenuLink href="/payments" text="Payments" />

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
                  className="menu menu-md dropdown-content bg-base-200 rounded-box z-1 mt-3 w-[115px] p-2 shadow-xs"
                >
                  <li>
                    <a href="/profile">Profile</a>
                  </li>
                  <li>
                    <SignOut type="button" />
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

type MenuLinkProps = {
  href: string;
  text: string;
};
function MenuLink({ href, text }: MenuLinkProps) {
  return (
    <li className="font-semibold">
      <Link href={href} className="group transition duration-200">
        {text}
        <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-1 bg-primary"></span>
      </Link>
    </li>
  );
}
