import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/authentication/provider";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/header";

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
    <html lang="en" className="min-h-screen" data-theme="mytheme">
      <body
        className={`${lexend.variable} antialiased flex flex-col min-h-screen bg-base-300`}
      >
        <AuthProvider>
          <Header />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { background: "#1e1e1e", color: "#fff", zIndex: 5 },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
