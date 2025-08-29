// app/notes/filter/[...slug]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { getNotes } from "@/lib/api";
import { tags, type NoteTag } from "@/types/note";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageParams = { slug?: string[] };
type PageSearch = { page?: string; search?: string };


export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: Promise<PageParams>;
    searchParams: Promise<PageSearch>;
  },
  _parent?: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const { page: pageStr, search: searchStr } = await searchParams;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const raw = slug?.[0] ? decodeURIComponent(slug[0]) : "all";
  const lower = raw.toLowerCase();
  const isAll = lower === "all";
  const matched = tags.find((t) => t.toLowerCase() === lower);
  const tag: NoteTag | undefined = isAll ? undefined : (matched as NoteTag | undefined);

  
  const titlePart = isAll ? "Усі нотатки" : `Нотатки з тегом “${matched ?? raw}”`;
  const descPart = isAll
    ? "Перегляд усіх нотаток у застосунку NoteHub."
    : `Перегляд нотаток, відфільтрованих за тегом “${matched ?? raw}”.`;

  const title = `${titlePart}`;
  const description = `${descPart}`;

 
  const path = `/notes/filter/${isAll ? "all" : matched ?? raw}`;
  const qs = new URLSearchParams();
  if (pageStr) qs.set("page", pageStr);
  if (searchStr) qs.set("search", searchStr);
  const url = `${siteUrl}${path}${qs.toString() ? `?${qs.toString()}` : ""}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "NoteHub",
      type: "website",
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
}

export default async function NotesFilterPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;          
  searchParams: Promise<PageSearch>;    
}) {
  const { slug } = await params;
  const { page: pageStr, search: searchStr } = await searchParams;

  const page = Number(pageStr ?? 1);
  const search = searchStr ?? "";

  const raw = slug?.[0] ? decodeURIComponent(slug[0]) : "all";
  const lower = raw.toLowerCase();
  const isAll = lower === "all";
  const matched = tags.find((t) => t.toLowerCase() === lower);
  const tag: NoteTag | undefined = isAll ? undefined : (matched as NoteTag | undefined);

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["notes", { page, search, tag: tag ?? null }],
    queryFn: () => getNotes({ page, search, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient initialPage={page} initialSearch={search} initialTag={tag ?? null} />
    </HydrationBoundary>
  );
}



