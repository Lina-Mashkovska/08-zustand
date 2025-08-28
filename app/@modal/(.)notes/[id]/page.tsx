// app/@modal/(.)notes/[id]/page.tsx
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getSingleNote } from "@/lib/api";
import NotePreview from "./NotePreview.client";

type Params = { id: string };

export default async function NoteModalInterceptedPage({
  params,
}: {
  params: Promise<Params>; // Next 15: Promise
}) {
  const { id } = await params;

  // SSR prefetch -> hydration
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getSingleNote(id),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}





