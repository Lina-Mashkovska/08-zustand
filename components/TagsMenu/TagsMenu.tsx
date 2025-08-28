// components/TagsMenu/TagsMenu.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./TagsMenu.module.css";
import { tags, type NoteTag } from "@/types/note";

type FilterTag = "All" | NoteTag;
const menuTags: FilterTag[] = ["All", ...tags];

const hrefFor = (tag: FilterTag) =>
  tag.toLowerCase() === "all" ? "/notes/filter/all" : `/notes/filter/${encodeURIComponent(tag)}`;

export default function TagsMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    setOpen(false);
  }, [pathname]);


  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className={css.menuContainer} ref={rootRef}>
      <button
        type="button"
        className={css.menuButton}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="tags-menu"
        onClick={() => setOpen((v) => !v)}
      >
        Notes ▾
      </button>

      <ul
        id="tags-menu"
        className={css.menuList}
        role="menu"
      
        style={{ display: open ? "block" : "none" }}
      >
        {menuTags.map((tag) => (
          <li key={tag} className={css.menuItem} role="none">
            <Link
              href={hrefFor(tag)}
              className={css.menuLink}
              role="menuitem"
              onClick={() => setOpen(false)} 
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}




