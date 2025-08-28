
import { notFound } from "next/navigation";
import { getSingleNote } from "@/lib/api";
import NotePreview from "@/components/NotPreview/NotePreview"; 
import css from "./NoteDetails.module.css"; 

export default async function NoteDetailsPage({ params }: { params: { id: string } }) {
  try {
    const note = await getSingleNote(params.id);
    return (
      <main className={css.wrapper}>
        <NotePreview note={note} />
      </main>
    );
  } catch {
    notFound();
  }
}
