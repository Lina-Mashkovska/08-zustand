// app/layout.tsx
import type { Metadata } from "next";
import React from "react";
import "./globals.css";

import { Roboto } from "next/font/google";
import { GeistMono } from "geist/font/mono";

import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";


const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NoteHub",
    template: "%s | NoteHub",
  },
  description:
    "NoteHub — застосунок для створення, пошуку та керування нотатками з тегами та пагінацією.",
  openGraph: {
    title: "NoteHub",
    description:
      "NoteHub — застосунок для створення, пошуку та керування нотатками з тегами та пагінацією.",
    url: siteUrl,
    siteName: "NoteHub",
    type: "website",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${GeistMono.variable}`}>
      <body>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}




