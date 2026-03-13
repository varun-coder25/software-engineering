import type { Metadata } from "next";
import { Manrope, Merriweather } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "VIT Academic Certificate & GPA Portal",
  description:
    "Frontend-ready academic portal with Supabase authentication, certificate upload, GPA, and CGPA calculators."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${merriweather.variable} font-[family-name:var(--font-sans)]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
