
import axios from "axios";
import type { Note, NewNote } from "@/types/note";

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

if (myKey) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${myKey}`;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

type GetNotesArgs = {
  page: number;
  perPage?: number;
  search?: string;
  tag?: string | null; 
};

export async function getNotes({
  page,
  perPage = 12,
  search = "",
  tag,
}: GetNotesArgs): Promise<NotesResponse> {

  const shouldPassTag = !!tag && tag !== "All";

  const response = await axios.get<NotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(shouldPassTag ? { tag } : {}),
    },
  });

  return response.data;
}

export const fetchNotes = (args: { page: number; search?: string; perPage?: number; tag?: string | null }) =>
  getNotes(args);

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await axios.get<Note>(`/notes/${id}`);
  return res.data;
}
export const getSingleNote = (id: string) => fetchNoteById(id);

export async function createNote(note: NewNote): Promise<Note> {
  const res = await axios.post<Note>("/notes", note);
  return res.data;
}
export const addNote = createNote;

export async function deleteNote(noteId: string): Promise<Note> {
  const res = await axios.delete<Note>(`/notes/${noteId}`);
  return res.data;
}
