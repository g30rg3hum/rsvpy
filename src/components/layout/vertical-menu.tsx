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
      <div className="drawer-content bg-base-100">
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
        <ul className="menu bg-base-200 text-base-content min-h-full w-60 p-4 space-y-2 border border-base-300">
          <li>
            <a>
              <HomeIcon className="size-8" />{" "}
              <span className="font-bold text-md">Dashboard</span>
            </a>
          </li>
          <li>
            <a>
              <CalendarDaysIcon className="size-8" />{" "}
              <span className="font-bold text-md">Events</span>
            </a>
          </li>
          <li>
            <a>
              <CreditCardIcon className="size-8" />{" "}
              <span className="font-bold text-md">Payments</span>
            </a>
          </li>
          <li>
            <a>
              <UserIcon className="size-8" />{" "}
              <span className="font-bold text-md">Profile</span>
            </a>
          </li>
          <li>
            <a>
              <ArrowRightEndOnRectangleIcon className="size-8" />{" "}
              <span className="font-bold text-md">Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
