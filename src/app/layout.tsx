import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Website",
  description: "Personal website showcasing my projects and skills.",
  icons: {
    icon: '/favicon.jpg',
  },
  openGraph: {
    title: "Abir Modak",
    description: "Personal website showcasing my projects and skills.",
    url: "https://abirmodak.github.io/personal-website-copy/",
    siteName: "Abir Modak",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abir Modak",
    description: "Personal website showcasing my projects and skills.",
  },
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
        {children}
      </body>
    </html>
  );
}
