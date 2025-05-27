import VerticalMenu from "@/components/layout/vertical-menu";
import { getSessionThenEmail } from "@/lib/auth/utils";
import { getUserByEmail } from "@/lib/db/user";

interface Props {
  children: React.ReactNode;
}
export default async function SideMenuLayout({ children }: Props) {
  // should be logged in
  const userEmail = await getSessionThenEmail();
  // would have been signed in at this point.
  const user = await getUserByEmail(userEmail);
  const name = user ? user.firstName + " " + user.lastName : "User";

  return <VerticalMenu name={name}>{children}</VerticalMenu>;
}
