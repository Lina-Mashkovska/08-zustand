import Link from "next/link";
import css from "./sidebarNotes.module.css";
import { tags } from "@/types/note";

export default function NotesSidebar() {
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href="/notes/filter/All" className={css.menuLink}>
          All
        </Link>
      </li>
      {tags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${encodeURIComponent(tag)}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}