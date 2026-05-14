"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Settings, ChevronRight } from "lucide-react";
import { useNotes } from "@/features/note/hooks/useNotes";
import { useNoteStore } from "@/features/note/store/useNoteStore";
import { Link, useRouter } from "@/i18n/navigation";
import { NoteItem } from "./NoteItem";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useTranslations } from "next-intl";

export default function SidebarList() {
  const { notes, createNote, deleteNote } = useNotes();
  const { activeNoteId, setActiveNoteId } = useNoteStore();
  const router = useRouter();
  const params = useParams();
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
const t = useTranslations("sidebar");

  const handleCreateNote = async () => {
    const newNote = await createNote("user_1");
    if (newNote?.id) {
      setActiveNoteId(newNote.id);
      router.push(`/notes/${newNote.id}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;
    await deleteNote(noteToDelete);

    // حل مشکل دکمه Back:
    // اگر در حال مشاهده نوت حذف شده هستیم، مسیر را با صفحه لیست جایگزین (Replace) کن
    if (params.id === noteToDelete) {
      setActiveNoteId(null);
      router.replace(`/notes`);
    }
    setNoteToDelete(null);
  };

  return (
    <div className="flex h-full flex-col bg-bg px-3 py-5">
      <button
        onClick={handleCreateNote}
        className="mb-6 flex h-11 items-center justify-between rounded-lg bg-surface px-3 text-primary shadow-sm border border-border-soft hover:bg-primary/5 transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <Plus size={18} strokeWidth={2.5} />
          <span className="font-bold text-xs">{t("newNote")}</span>
        </div>
        <kbd className="text-[9px] opacity-50 font-sans">{t("shortcutHint")}</kbd>
      </button>

      <div className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            isActive={activeNoteId === note.id}
            onDeleteRequest={setNoteToDelete}
            onClick={setActiveNoteId}
          />
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-border-soft/50">
        <Link href={"/notes/setting"} className="w-full flex h-10 items-center justify-between rounded-lg border border-border-soft bg-surface px-3 text-text-soft hover:bg-surface-muted transition-all text-xs font-bold">
          <div className="flex items-center gap-2.5">
            <Settings size={16} />
            <span>{t("settings")}</span>
          </div>
          <ChevronRight size={14} />
        </Link>
      </div>

      <DeleteConfirmDialog
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
