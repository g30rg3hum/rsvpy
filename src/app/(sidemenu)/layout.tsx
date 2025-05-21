import VerticalMenu from "@/components/layout/vertical-menu";

interface Props {
  children: React.ReactNode;
}
export default function SideMenuLayout({ children }: Props) {
  return <VerticalMenu>{children}</VerticalMenu>;
}
