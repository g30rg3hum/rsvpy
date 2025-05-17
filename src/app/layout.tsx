import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import Header from "../../components/layout/header";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "rsvpy",
  description:
    "Plan, create and organise your events, keeping track of attendees and payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
