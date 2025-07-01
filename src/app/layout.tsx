import type { Metadata } from "next";
import { Averia_Libre } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/authentication/provider";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/header";

const averia_libre = Averia_Libre({
  variable: "--font-averia-libre",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
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
    <html lang="en" data-theme="mytheme">
      <body
        className={`${averia_libre.variable} antialiased flex flex-col h-full min-h-screen bg-base-300 font-averia-libre`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-grow flex flex-col justify-start">
            {children}
          </main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1e1e1e",
                color: "#fff",
                zIndex: 5,
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
