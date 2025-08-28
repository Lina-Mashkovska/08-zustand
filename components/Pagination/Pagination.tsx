
"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;              
  currentPage: number;             
  onPageChange: (page: number) => void; 
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {

  if (!pageCount || pageCount <= 1) return null;

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={Math.max(0, currentPage - 1)} 
      onPageChange={({ selected }: { selected: number }) =>
        onPageChange(selected + 1)
      }
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel="←"
      nextLabel="→"
      renderOnZeroPageCount={null}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
    />
  );
}
