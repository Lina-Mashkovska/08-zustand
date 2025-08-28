// components/Modal/Modal.tsx
"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import NotePreview from "@/components/NotPreview/NotePreview";
import type { Note } from "@/types/note";
import css from "./Modal.module.css";


export default function Modal({
  onClose,
  children,
  isOpen = true,
}: {
  onClose: () => void;
  children: ReactNode;
  isOpen?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onBackdrop}>
      <div className={css.modal}>{children}</div>
    </div>,
    document.body
  );
}


export function NoteModal({ note }: { note: Note }) {
  const router = useRouter();
  const handleClose = () => router.back();
  return (
    <Modal onClose={handleClose}>
      <NotePreview note={note} />
    </Modal>
  );
}


