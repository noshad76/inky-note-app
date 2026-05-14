import { useNotes } from "@/features/note/hooks/useNotes";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function SidebarList() {
  const { notes, createNote } = useNotes();
  const locale = useLocale();

  return (
    <div className="flex h-full flex-col p-4">
      <button 
        onClick={() => createNote('user_1')}
        className="mb-6 flex items-center justify-between rounded-xl bg-indigo-600 p-3 text-white hover:bg-indigo-700 transition-colors"
      >
        <span className="font-medium">New Note</span>
        <span className="text-xl">+</span>
      </button>

      {/* لیست نوت‌ها با اسکرول داخلی */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {notes.map((note) => (
          <Link 
            key={note.id} 
            href={`/${locale}/notes/${note.id}`}
            className="block rounded-lg p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b border-neutral-50 dark:border-neutral-800"
          >
            <div className="font-medium truncate">{note.title || "Untitled"}</div>
            <div className="text-xs text-neutral-400 truncate">{note.content?.substring(0, 30)}</div>
          </Link>
        ))}
      </div>

      <button className="mt-4 flex items-center gap-2 rounded-lg p-2 text-neutral-600 hover:bg-neutral-100">
        <span className="text-sm font-medium text-black">Settings</span>
      </button>
    </div>
  );
}
