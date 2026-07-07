import type { Metadata } from "next";
import { Archivo_Black, Fraunces, Geist, Geist_Mono, Inter, JetBrains_Mono, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Sol.des case-study fonts: Fraunces (wonky italics) + self-hosted Clash Display.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const clashDisplay = localFont({
  variable: "--font-clash",
  src: "./fonts/ClashDisplay-Variable.woff2",
  weight: "200 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Personal Website",
  description: "Personal website showcasing my projects and skills.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${archivoBlack.variable} ${spaceMono.variable} ${jetBrainsMono.variable} ${fraunces.variable} ${clashDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
