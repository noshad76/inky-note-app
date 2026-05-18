"use client";
import { Link } from "@/i18n/navigation";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Note } from "@/features/note/types/notes";
import { safeJsonParse } from "@/lib/utils/safeJson";
import { ROUTES } from "@/lib/constants/routes";

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onDeleteRequest: (id: string) => void;
  onClick: (id: string) => void;
}
export function getNoteTitle(note: Note) {
  if (note.title && note.title.trim() !== "") {
    return note.title;
  }

  const json = safeJsonParse(note.content);
  if (!json || !json.content) return "Untitled";

  const findFirstText = (contentArray: any[]): string | null => {
    for (const node of contentArray) {
      if (node.text) return node.text;
      if (node.content) {
        const childText = findFirstText(node.content);
        if (childText) return childText;
      }
    }
    return null;
  };

  const extractedText = findFirstText(json.content);

  return extractedText?.trim() || "Untitled";
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
        href={ROUTES.NOTES.DETAIL(note.id)}
        onClick={() => onClick(note.id)}
        className={cn(
          "flex flex-col justify-center h-14 px-3 rounded-lg transition-all border border-transparent ",
          isActive
            ? "bg-surface border-border-soft border-s-primary border-s-2"
            : "hover:bg-surface/50 border border-border-soft",
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
              {getNoteTitle(note)}
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
