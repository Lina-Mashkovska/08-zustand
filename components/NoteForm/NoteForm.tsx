// components/NoteForm/NoteForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";

import { useNoteStore } from "@/lib/store/noteStore";
import { tags, type NoteTag, type NewNote } from "@/types/note";
import { createNote as createNoteApi } from "@/lib/api";

interface NoteFormProps {
  onClose?: () => void; 
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const [localError, setLocalError] = useState<string | null>(null);


  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: NewNote) => createNoteApi(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      if (onClose) onClose();
      else router.back();
    },
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "tag") setDraft({ tag: value as NoteTag });
    else if (name === "title" || name === "content") setDraft({ [name]: value });
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const payload: NewNote = {
      title: draft.title.trim(),
      content: draft.content.trim(),
      tag: draft.tag,
    };

    if (!payload.title) {
      setLocalError("Title є обов'язковим");
      return;
    }

    try {
      await mutateAsync(payload);
    } catch {
      setLocalError("Не вдалося створити нотатку. Спробуйте ще раз.");
    }
  };


  const onCancel = () => {
    if (onClose) onClose();
    else router.back();
  };

  return (
    <form className={css.form} onSubmit={onSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={onChange}
          placeholder="Enter title"
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={onChange}
          placeholder="Write your note..."
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={onChange}
        >
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {(localError || error) && (
        <span className={css.error}>
          {localError ?? "Не вдалося створити нотатку. Спробуйте ще раз."}
        </span>
      )}

      <div className={css.actions}>
        <button type="button" onClick={onCancel} className={css.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}

