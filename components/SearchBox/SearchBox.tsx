import css from "../SearchBox/SearchBox.module.css";

interface SearchBoxProps {
    value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
    return (
      <input
  className={css.input}
  type="text"
  name="search"
  id="search"
  placeholder="Search notes"
  value={value}
  onChange={(e) => onChange(e.target.value)}
/>
    );
  }