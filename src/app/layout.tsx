import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});


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
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
