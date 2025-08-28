import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { getNotes } from "@/lib/api";
import { tags, type NoteTag } from "@/types/note";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageParams = { slug?: string[] };
type PageSearch = { page?: string; search?: string };

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
      <NotesClient
        initialPage={page}
        initialSearch={search}
        initialTag={tag ?? null}
      />
    </HydrationBoundary>
  );
}


