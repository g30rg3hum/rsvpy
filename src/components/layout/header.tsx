"use client";

/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import SignOut from "../authentication/sign-out";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";

export default function Header() {
  const { data: session } = useSession();
  const email = session?.user?.email; // defined if logged in.

  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchUserDetails = async () => {
      const res = await fetch(`/api/users?email=${email}`, {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setUserDetails(data);
      }
    };

    fetchUserDetails();
  }, [email]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (userDetails) {
        // id is defined
        const res = await fetch(`/api/s3/${userDetails.id}`, {
          method: "GET",
        });

        if (res.ok) {
          setProfilePictureUrl(
            `https://rsvpy.s3.eu-north-1.amazonaws.com/profile-pictures/${userDetails.id}`
          );
        } else {
          setProfilePictureUrl(null);
        }
      }
    };

    fetchProfilePicture();
  });

  return (
    <div className="navbar pr-6 pl-5 py-6">
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
                  className="btn btn-ghost btn-circle avatar w-12"
                >
                  <div
                    className="rounded-full border border-base-300 w-12 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${profilePictureUrl})`,
                    }}
                  />
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
