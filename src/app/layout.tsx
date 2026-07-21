import type { Metadata, Viewport } from "next";
import { Quicksand, Knewave } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-body",
  subsets: ["latin"],
});

const knewave = Knewave({
  variable: "--font-header",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Ramble | Kalamazoo, MI",
  description:
    "Weekly group rides in Kalamazoo, MI — Mondays and Thursdays.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#c84b11",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body
        className={`${quicksand.variable} ${knewave.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
