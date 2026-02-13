import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Access Restricted",
  description: "Private access page.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-navy text-white antialiased">{children}</body>
    </html>
  );
}