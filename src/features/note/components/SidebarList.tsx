"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Settings,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useNotes } from "@/features/note/hooks/useNotes";
import { Link, useRouter } from "@/i18n/navigation";
import { NoteItem, getNoteTitle } from "./NoteItem";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";
import { useSyncNotes } from "../hooks/useSyncNotes";
import { LocalNote } from "../types/notes";
import { cn } from "@/lib/utils/cn";

interface SidebarListProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function SidebarList({
  isCollapsed,
  onToggleCollapse,
}: SidebarListProps) {
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
  const t = useTranslations("sidebar");
  const searchParams = useSearchParams();
  const noteIdFromQuery = searchParams.get("id");
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
      if (noteIdFromQuery === idToRemove) {
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

  // حالت collapsed
  if (isCollapsed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-between py-5">
        {/* بالا: دکمه expand + دکمه new note */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onToggleCollapse}
            title="Expand sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-soft bg-surface text-text-muted hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
          >
            <PanelLeftOpen size={15} />
          </button>

          <button
            onClick={handleCreateNote}
            disabled={isCreating || isLoading}
            title={t("newNote")}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-soft bg-surface text-primary hover:bg-primary/5 transition-all shadow-sm disabled:opacity-50"
          >
            <Plus
              size={15}
              strokeWidth={2.5}
              className={isCreating ? "animate-spin" : ""}
            />
          </button>
        </div>

        {/* وسط: لیست نوت‌ها با حرف اول */}
        <div className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto py-3 custom-scrollbar w-full px-1">
          {localNotes.map((note: LocalNote) => {
            const title = getNoteTitle(note);
            const firstChar = title.charAt(0).toUpperCase();
            const isActive = activeNoteId === note.id;

            return (
              <Link
                key={note.id}
                href={ROUTES.NOTES.DETAIL(note.id)}
                onClick={() => selectNote(note.id)}
                title={title}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-all",
                  isActive
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border-soft bg-surface text-text-muted hover:text-primary hover:bg-primary/5",
                )}
              >
                {firstChar}
              </Link>
            );
          })}
        </div>

        {/* پایین: دکمه settings */}
        <Link
          href={ROUTES.NOTES.SETTINGS}
          title={t("settings")}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-soft bg-surface text-text-muted hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
        >
          <Settings size={15} />
        </Link>
      </div>
    );
  }

  // حالت expanded (بدون تغییر)
  return (
    <div className="flex h-full flex-col bg-bg px-3 py-5">
      <div className="mb-6 flex items-center gap-2">
        <button
          onClick={handleCreateNote}
          disabled={isCreating || isLoading}
          className="flex-1 flex h-11 items-center justify-between rounded-lg bg-surface px-3 text-primary shadow-sm border border-border-soft hover:bg-primary/5 transition-all disabled:opacity-50"
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

        <button
          onClick={onToggleCollapse}
          title="Collapse sidebar"
          className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg border border-border-soft bg-surface text-text-muted hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
        >
          <PanelLeftClose size={15} />
        </button>
      </div>

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
