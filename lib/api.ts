// lib/api/notes.ts
import axios from "axios";
import type { Note, NewNote } from "@/types/note";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN ?? "";

const client = axios.create({
  baseURL: BASE_URL,
  headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : undefined,
});

type GetNotesArgs = {
  page: number;
  perPage?: number;
  search?: string;
  tag?: string | undefined;
};

export const getNotes = async ({
  page,
  perPage = 12,
  search = "",
  tag,
}: GetNotesArgs): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const isAll = typeof tag === "string" && tag.toLowerCase() === "all";
  if (tag && !isAll) params.tag = tag;

  const res = await client.get<NotesResponse>("/notes", { params });
  if (!res.data?.notes || typeof res.data.totalPages !== "number") {
    throw new Error("Invalid API response: missing notes or totalPages");
  }
  return res.data;
};

export const getSingleNote = async (id: string): Promise<Note> => {
  const res = await client.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (payload: NewNote): Promise<Note> => {
  const res = await client.post<Note>("/notes", payload);
  return res.data;
};

export const addNote = createNote;

export const deleteNote = async (noteId: string): Promise<Note> => {
  const res = await client.delete<Note>(`/notes/${noteId}`);
  return res.data;
};





