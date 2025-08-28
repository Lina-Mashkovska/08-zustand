// app/notes/filter/@sidebar/page.tsx
import Link from "next/link";
import css from "./sidebarNotes.module.css";
import { tags, type NoteTag } from "@/types/note";

type FilterTag = "All" | NoteTag;
const menuTags: FilterTag[] = ["All", ...tags];

const hrefFor = (tag: FilterTag) =>
  tag.toLowerCase() === "all" ? "/notes/filter/All" : `/notes/filter/${encodeURIComponent(tag)}`;

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      {menuTags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link href={hrefFor(tag)} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
