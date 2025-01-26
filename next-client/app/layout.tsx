import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { verifyUserAccess } from "@/lib/server-utils";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin", "cyrillic-ext"],
});

export const metadata: Metadata = {
  title: "Chattify",
  // TODO: Change description to normal one
  description: "Add description later lol",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await verifyUserAccess();

  console.log(user);

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
