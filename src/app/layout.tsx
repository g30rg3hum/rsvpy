import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/header";
import AuthProvider from "@/components/authentication/provider";
import { Toaster } from "react-hot-toast";

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
    <html lang="en" className="min-h-screen">
      <body
        className={`${lexend.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <Header />
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
