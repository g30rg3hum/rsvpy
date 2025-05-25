"use client";

/* eslint-disable @next/next/no-img-element */
import {
  Bars3Icon,
  CalendarDaysIcon,
  CreditCardIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface Props {
  name: string;
  children: React.ReactNode;
}
export default function VerticalMenu({ name, children }: Props) {
  return (
    <div className="drawer lg:drawer-open bg-base-200">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-base-200">
        <div className="navbar bg-base-100 shadow-xs flex justify-between lg:justify-end text-black gap-2 px-3">
          <label
            htmlFor="my-drawer"
            className="btn btn-light btn-square drawer-button lg:hidden"
          >
            <Bars3Icon className="size-7" />
          </label>
          <div className="flex gap-2 items-center">
            <p className="font-bold">{name}</p>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-12 rounded-full">
                  <img src="/images/portrait.png" alt="User profile picture" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a href="#">Profile</a>
                </li>
                <li>
                  <a href="#">Settings</a>
                </li>
                <li>
                  <a onClick={() => signOut({ callbackUrl: "/" })}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-neutral-900 text-white text-base-content min-h-full w-60 p-4 space-y-2">
          <div className="w-full flex justify-center">
            <Image
              src="/images/logo_white.png"
              alt="rsvpy logo"
              width={135}
              height={0}
              className="hover:scale-105 transition-transform my-4"
            />
          </div>

          <MenuLink
            href="#"
            icon={<HomeIcon className="size-8" />}
            text="Dashboard"
          />
          <MenuLink
            href="/events"
            icon={<CalendarDaysIcon className="size-8" />}
            text="Events"
          />
          <MenuLink
            href="#"
            icon={<CreditCardIcon className="size-8" />}
            text="Payments"
          />
        </ul>
      </div>
    </div>
  );
}

interface MenuLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
}
function MenuLink({ href, icon, text }: MenuLinkProps) {
  return (
    <li>
      <a className="hover:bg-neutral-800" href={href}>
        {icon} <span className="font-bold text-md">{text}</span>
      </a>
    </li>
  );
}
