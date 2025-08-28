
"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
    },
    onError: (error) => {
      console.error("Failed to delete note:", error);
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            {}
            <Link
              href={`/notes/${note.id}`}
              className={css.link}
              aria-label={`View details for ${note.title}`}
            >
              View details
            </Link>

            <button
              className={css.button}
              onClick={() => mutate(note.id)}
              disabled={isPending}
              aria-disabled={isPending}
              aria-label={`Delete note ${note.title}`}
            >
              {isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
