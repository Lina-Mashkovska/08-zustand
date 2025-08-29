// components/NoteForm/NoteForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import css from "./NoteForm.module.css";

import { useNoteStore } from "@/lib/store/noteStore";
import { tags, type NoteTag, type NewNote } from "@/types/note";
import { createNote as createNoteApi } from "@/lib/api";

interface NoteFormProps {
  onClose?: () => void; // опційно: якщо колись знову буде модалка
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Автозбереження в Zustand при кожній зміні
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "tag") setDraft({ tag: value as NoteTag });
    else if (name === "title" || name === "content") setDraft({ [name]: value });
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const payload: NewNote = {
        title: draft.title.trim(),
        content: draft.content.trim(),
        tag: draft.tag,
      };

      if (!payload.title) {
        setErrorMsg("Title є обов'язковим");
        setIsSubmitting(false);
        return;
      }

      await createNoteApi(payload);

      // Успішно: чистимо draft і повертаємось назад
      clearDraft();
      if (onClose) onClose();
      else router.back();
    } catch (err) {
      console.error(err);
      setErrorMsg("Не вдалося створити нотатку. Спробуйте ще раз.");
      setIsSubmitting(false);
    }
  };

  // Cancel — без очищення draft
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

      {errorMsg && <span className={css.error}>{errorMsg}</span>}

      <div className={css.actions}>
        <button type="button" onClick={onCancel} className={css.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
