import { db } from "@/lib/db/db";
import { LocalNote } from "@/features/note/types/notes";

export const LocalNoteService = {
  async createNote(userId: string, title: string, content: string) {
    const now = Date.now();
    const newNote: LocalNote = {
      id: crypto.randomUUID(),
      userId,
      title,
      content,
      createdAt: now,
      updatedAt: now,
      syncStatus: "pending",
      deletedAt: null,
    };

    await db.notes.add(newNote);
    return newNote;
  },
  async deleteNote(id: string) {
    return await db.notes.update(id, {
      deletedAt: Date.now(),
      syncStatus: "pending",
    });
  },

  async updateNote(id: string, updates: Partial<LocalNote>) {
    return await db.notes.update(id, {
      ...updates,
      updatedAt: Date.now(),
      syncStatus: "pending",
    });
  },

  async getActiveNotes() {
    return await db.notes
      .filter((note) => note.deletedAt === null)
      .reverse()
      .sortBy("updatedAt");
  },
};
