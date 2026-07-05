import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Akamoto - Fast City Deliveries, On Demand",
  description:
    "Send packages across your city in minutes. Akamoto connects you with nearby riders for fast, affordable, and trackable local deliveries.",
  keywords: ["local delivery", "city courier", "same-day delivery", "package delivery", "on-demand delivery"],
  openGraph: {
    title: "Akamoto - Fast City Deliveries, On Demand",
    description: "Send packages across your city in minutes with nearby riders.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

