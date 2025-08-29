// app/not-found.tsx
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

import css from "./page.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "Сторінка не існує або була переміщена. Перевірте адресу або поверніться на головну.",
  openGraph: {
    title: "Page not found",
    description:
      "Сторінка не існує або була переміщена. Перевірте адресу або поверніться на головну.",
    url: `${siteUrl}/not-found`,
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub — 404 not found",
      },
    ],
    type: "website",
    siteName: "NoteHub",
  },
};

export default function NotFoundPage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>404 — Page not found</h1>
        <p className={css.text}>
          На жаль, такої сторінки не існує. Можливо, посилання застаріло або було
          змінене.
        </p>
        <Link href="/" className={css.link}>
          Повернутися на головну
        </Link>
      </div>
    </main>
  );
}
