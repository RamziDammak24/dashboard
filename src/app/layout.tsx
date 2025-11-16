import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Electron + Next.js App",
  description: "A desktop application built with Electron and Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
