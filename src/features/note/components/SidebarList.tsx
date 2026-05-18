"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Plus, Settings, ChevronRight } from "lucide-react";
import { useNotes } from "@/features/note/hooks/useNotes";
import { Link, useRouter } from "@/i18n/navigation";
import { NoteItem } from "./NoteItem";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";
import { useSyncNotes } from "../hooks/useSyncNotes";
import { LocalNote } from "../types/notes"; //

export default function SidebarList() {
  const {
    notes: localNotes,
    activeNoteId,
    selectNote,
    createNote,
    deleteNote,
    isLoading,
  } = useNotes();

  const { triggerSync } = useSyncNotes();
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("sidebar");

  const [isCreating, setIsCreating] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const handleCreateNote = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const newNote = await createNote();
      if (newNote) {
        selectNote(newNote.id);
        router.push(ROUTES.NOTES.DETAIL(newNote.id));
        triggerSync();
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;
    const idToRemove = noteToDelete;
    setNoteToDelete(null);

    try {
      await deleteNote(idToRemove);
      if (params.id === idToRemove) {
        selectNote(null);
        router.replace(ROUTES.NOTES.ROOT);
      }
      triggerSync();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleCreateNote();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCreateNote]);

  return (
    <div className="flex h-full flex-col bg-bg px-3 py-5">
      <button
        onClick={handleCreateNote}
        disabled={isCreating || isLoading}
        className="mb-6 flex h-11 items-center justify-between rounded-lg bg-surface px-3 text-primary shadow-sm border border-border-soft hover:bg-primary/5 transition-all disabled:opacity-50"
      >
        <div className="flex items-center gap-2.5">
          <Plus
            size={18}
            strokeWidth={2.5}
            className={isCreating ? "animate-spin" : ""}
          />
          <span className="font-bold text-xs">{t("newNote")}</span>
        </div>
        <kbd className="text-caption opacity-50 font-sans text-[10px]">
          {t("shortcutHint") || "Ctrl+B"}
        </kbd>
      </button>

      <div className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar">
        {isLoading ? (
          <div className="text-center py-10 text-text-muted text-xs opacity-50">
            Loading notes...
          </div>
        ) : localNotes.length === 0 && !isCreating ? (
          <div className="text-center py-10 text-text-muted text-xs opacity-50">
            {t("noNotes") || "No notes found"}
          </div>
        ) : (
          localNotes.map((note: LocalNote) => (
            <NoteItem
              key={note.id}
              note={note}
              isActive={activeNoteId === note.id}
              onDeleteRequest={setNoteToDelete}
              onClick={selectNote}
            />
          ))
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-border-soft/50">
        <Link
          href={ROUTES.NOTES.SETTINGS}
          className="w-full flex h-10 items-center justify-between rounded-lg border border-border-soft bg-surface px-3 text-text-soft hover:bg-surface-muted transition-all text-xs font-bold"
        >
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
