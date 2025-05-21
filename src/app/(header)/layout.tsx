import Header from "@/components/layout/header";

interface Props {
  children: React.ReactNode;
}
export default function HeaderLayout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
