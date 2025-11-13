import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Management System",
  description: "Manage interviews and collect feedback from panelists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
