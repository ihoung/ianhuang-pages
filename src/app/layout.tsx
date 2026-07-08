import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import "./globals.css";
import { asset } from "@/lib/asset";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ian Huang's Portfolio",
  description:
    "Personal portfolio showcasing digital work at the intersection of design and engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased min-h-screen`}
      >
        {/* Static background — shared across all pages. Uses next/image so
            basePath is auto-applied in GH Pages. */}
        <div aria-hidden className="fixed inset-0 z-0 page-bg">
          <Image
            src={asset("/page-bg.png")}
            alt=""
            fill
            unoptimized
            priority
            className="object-cover"
          />
        </div>

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
