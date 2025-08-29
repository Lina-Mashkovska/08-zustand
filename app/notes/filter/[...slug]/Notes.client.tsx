"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { getNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Link from "next/link";

import css from "./page.module.css";

type Props = {
  initialSearch: string;
  initialPage: number;
  initialTag: string | null;
};

export default function NotesClient({ initialSearch, initialPage, initialTag }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState<string>(initialSearch ?? "");
  const [page, setPage] = useState<number>(initialPage ?? 1);
  const tag = initialTag ?? undefined;

  useEffect(() => {
    setPage(initialPage ?? 1);
  }, [initialPage]);

  useEffect(() => {
    setSearchQuery(initialSearch ?? "");
  }, [initialSearch]);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) sp.set("search", value);
    else sp.delete("search");
    sp.set("page", "1");
    router.push(`?${sp.toString()}`);
    setSearchQuery(value);
    setPage(1);
  }, 400);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { page, search: searchQuery, tag: tag ?? null }],
    queryFn: () => getNotes({ page, search: searchQuery, tag }),
    placeholderData: keepPreviousData,
  });

  const onSearchChange = (value: string) => {
    updateSearchQuery(value);
  };

  const onPageChange = (next: number) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("page", String(next));
    router.push(`?${sp.toString()}`);
    setPage(next);
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !data) return <p>Failed to load notes.</p>;

  const totalPages = data.totalPages;

  return (
    <section className={css.wrapper}>
      <div className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={onSearchChange} />

        {/* 🔽 кнопка → Link на /notes/action/create */}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {data.notes.length === 0 ? (
        <p className={css.empty}>No notes yet. Try changing the search or tag.</p>
      ) : (
        <NoteList notes={data.notes} />
      )}

      {/* 🔽 пагінація окремо під списком */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          pageCount={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
}


