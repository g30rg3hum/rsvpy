import {
  ArrowRightEndOnRectangleIcon,
  Bars3Icon,
  CalendarDaysIcon,
  CreditCardIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

interface Props {
  children: React.ReactNode;
}
export default function VerticalMenu({ children }: Props) {
  return (
    <div className="drawer lg:drawer-open bg-base-200">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-base-200">
        <label
          htmlFor="my-drawer"
          className="btn btn-light btn-square drawer-button lg:hidden m-3"
        >
          <Bars3Icon className="size-7" />
        </label>
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-neutral-900 text-white text-base-content min-h-full w-60 p-4 space-y-2 border border-base-300">
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
          <MenuLink
            href="#"
            icon={<UserIcon className="size-8" />}
            text="Profile"
          />
          <MenuLink
            href="#"
            icon={<ArrowRightEndOnRectangleIcon className="size-8" />}
            text="Logout"
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
