import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trakr",
  description:
    "The centrl hub for monitoring project status, managing team member access, and tracking progress towards deadlines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <Header />
          <div className="pt-20 md:pt-24 max-w-7xl mx-auto p-3 sm:p-4 md:p-5">
            {children}
          </div>
          <Toaster />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
