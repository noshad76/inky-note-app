// features/note/components/NoteItem.tsx
"use client";
import { Link } from "@/i18n/navigation";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Note } from "@/features/note/types/notes";

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onDeleteRequest: (id: string) => void;
  onClick: (id: string) => void;
}

export function NoteItem({
  note,
  isActive,
  onDeleteRequest,
  onClick,
}: NoteItemProps) {
  return (
    <div className="group relative">
      <Link
        href={`/notes/${note.id}`}
        onClick={() => onClick(note.id)}
        className={cn(
          "flex flex-col justify-center h-14 px-3 rounded-lg transition-all border border-transparent",
          isActive
            ? "bg-surface border-border-soft shadow-sm"
            : "hover:bg-surface/50",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                "text-xs font-semibold truncate",
                isActive ? "text-primary" : "text-text",
              )}
            >
              {note.title || "Untitled"}
            </div>
            <div className="text-[10px] text-text-muted mt-1">
              {new Date(note.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDeleteRequest(note.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-text-muted hover:text-danger hover:bg-danger/5 rounded-md transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </Link>
    </div>
  );
}
