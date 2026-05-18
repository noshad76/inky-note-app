import { LocalNote, NotePushPayload, Note } from "../types/notes";
const toIsoString = (value: string | number | Date | null | undefined) => {
  if (value == null) return null;
  if (typeof value === "string") return value;
  return new Date(value).toISOString();
};
export const normalizeString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export const mapLocalNoteToPushDTO = (note: LocalNote): NotePushPayload => {
  return {
    id: note.id,
    title: normalizeString(note.title),
    content: normalizeString(note.content),
    updatedAt: toIsoString(note.updatedAt)!,
    deletedAt: toIsoString(note.deletedAt),
  };
};
const normalizeContent = (content: unknown) => {
  if (!content) return null;

  if (typeof content === "string") {
    try {
      return JSON.parse(content);
    } catch {
      return {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: content }],
          },
        ],
      };
    }
  }

  return content;
};

export const mapPullDTOToLocalNote = (
  note: Note,
  userId: string,
): LocalNote => {
  return {
    id: note.id,
    userId,
    title: note.title ?? "",
    content: normalizeContent(note.content),
    updatedAt: note.updatedAt,
    deletedAt: note.deletedAt ?? null,
    syncStatus: "synced",
  };
};
