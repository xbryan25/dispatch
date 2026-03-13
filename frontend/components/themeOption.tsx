export default function ThemeOption({
  id,
  label,
  color,
  onSelect,
}: {
  id: string;
  label: string;
  color: string;
  onSelect: (themeId: string) => void;
}) {
  return (
    <button
      className="flex items-center gap-2 hover:bg-stone-200 dark:hover:bg-stone-700 px-1 py-2 rounded-lg cursor-pointer"
      onClick={() => onSelect(id)}
    >
      <div className={`${color} rounded-full size-5`}></div>
      {label}
    </button>
  );
}
