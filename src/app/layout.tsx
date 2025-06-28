import type { Metadata } from "next";
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

import "./globals.css";
import UserProvider from "@/context/UserContext";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Comic Reader",
  description: "A digital platform for reading comics and stories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="antialiased">
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
