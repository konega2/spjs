import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "San Valentín Interactivo 💙",
  description: "Regalo interactivo de San Valentín hecho con amor.",
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