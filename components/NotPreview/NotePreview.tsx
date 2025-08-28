
"use client";

import type { Note } from "@/types/note";
import css from "./NotPreview.module.css";

export default function NotePreview({ note }: { note: Note }) {
  return (
    <article className={css.preview}>
      <h2 className={css.title}>{note.title}</h2>
      <p className={css.content}>{note.content}</p>
      <div className={css.meta}>
        <span className={css.tag}>{note.tag}</span>
        <time className={css.date}>{new Date(note.createdAt).toLocaleString()}</time>
      </div>
    </article>
  );
}
