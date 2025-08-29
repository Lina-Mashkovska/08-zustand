// app/notes/action/create/page.tsx
import type { Metadata } from "next";
import React from "react";

import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Create note",
  description: "Сторінка для створення нової нотатки у NoteHub.",
  openGraph: {
    title: "Create note",
    description: "Створіть нову нотатку у застосунку NoteHub.",
    url: `${siteUrl}/notes/action/create`,
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

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
