// app/notes/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSingleNote } from "@/lib/api";
import NotePreview from "@/components/NotPreview/NotePreview"; 
import css from "./NoteDetails.module.css"; 


export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const note = await getSingleNote(params.id);

    
    const plain = (note.content ?? "").replace(/\s+/g, " ").trim();
    const short =
      plain.length > 160 ? `${plain.slice(0, 157)}…` : plain || "Note details";

    const title = note.title || "Note details";

    return {
      title,
      description: short,
      openGraph: {
        title,
        description: short,
        url: `${siteUrl}/notes/${params.id}`,
        siteName: "NoteHub",
        type: "article",
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
  } catch {
   
    const title = "Note not found";
    const description = "Такої нотатки не існує або вона була видалена.";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${siteUrl}/notes/${params.id}`,
        siteName: "NoteHub",
        type: "article",
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "NoteHub — note not found",
          },
        ],
      },
    };
  }
}

export default async function NoteDetailsPage({
  params,
}: {
  params: { id: string };
}) {
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

