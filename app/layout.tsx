import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClaimLin",
  description: "Empathetic Fire & Flood Claims Companion for Malaysia",
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
