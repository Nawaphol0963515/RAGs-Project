import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// This loads a clean, modern font
const inter = Inter({ subsets: ["latin"] });

// This changes the text in the browser tab!
export const metadata: Metadata = {
  title: "RAG AI",
  description: "AI assistant for analyzing Thai financial 56-1 ONE Reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={inter.className}>{children}</body>
    </html>
  );
}