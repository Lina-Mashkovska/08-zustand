// lib/store/noteStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NewNote } from "@/types/note";

export const initialDraft: NewNote = {
  title: "",
  content: "",
  tag: "Todo",
};

type NoteStore = {
  draft: NewNote;
  setDraft: (next: Partial<NewNote>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (next) =>
        set((state) => ({
          draft: { ...state.draft, ...next },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "notehub-draft", 
      version: 1,
      partialize: (state) => ({ draft: state.draft }), 
    }
  )
);

