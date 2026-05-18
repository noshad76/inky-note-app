import { db } from "@/lib/db/db";
import { LocalNote, SyncStatus } from "@/features/note/types/notes";
import { normalizeString } from "../utils/mapper";

export type RemoteNote = Omit<LocalNote, "syncStatus">;

export const LocalNoteService = {
  async createNote(
    userId: string,
    title: string,
    content: string,
  ): Promise<LocalNote> {
    const now = new Date().toISOString();
    const newNote: LocalNote = {
      id: crypto.randomUUID(),
      userId,
      title,
      content,
      updatedAt: now,
      deletedAt: null,
      syncStatus: "pending",
    };

    await db.notes.add(newNote);
    return newNote;
  },

  async migrateGuestNotes(actualUserId: string): Promise<void> {
    const guestNotes = await db.notes.where("userId").equals("guest").toArray();
    if (guestNotes.length === 0) return;

    const updates = guestNotes.map((note) => ({
      key: note.id,
      changes: {
        userId: actualUserId,
        syncStatus: "pending" as SyncStatus,
      },
    }));

    await db.notes.bulkUpdate(updates);
  },

  async deleteNote(id: string): Promise<void> {
    await db.notes.update(id, {
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: "pending",
    });
  },

  async getLatestUpdatedAt(): Promise<string | null> {
    const note = await db.notes
      .where("deletedAt")
      .equals(null)
      .reverse()
      .sortBy("updatedAt");
    return note[0]?.updatedAt ?? null;
  },

  async getPendingNotes(): Promise<LocalNote[]> {
    return await db.notes.where("syncStatus").equals("pending").toArray();
  },

  async getActiveNotes(search?: string) {
    const notes = await db.notes
      .filter((note) => note.deletedAt === null)
      .toArray();

    if (!search) {
      return notes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }

    const q = search.toLowerCase();

    return notes
      .filter((note) => {
        const title = normalizeString(note.title).toLowerCase();
        const content = normalizeString(note.content).toLowerCase();

        return title.includes(q) || content.includes(q);
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async getNoteById(id: string): Promise<LocalNote | undefined> {
    return await db.notes.get(id);
  },

  async upsertFromRemote(remote: RemoteNote): Promise<void> {
    const existing = await db.notes.get(remote.id);

    if (!existing) {
      await db.notes.add({
        ...remote,
        syncStatus: "synced",
      });
      return;
    }

    const isRemoteNewer = remote.updatedAt > existing.updatedAt;

    if (isRemoteNewer) {
      await db.notes.update(remote.id, {
        ...remote,
        syncStatus: "synced",
      });
    }
  },

  async upsertManyFromRemote(notes: RemoteNote[]): Promise<void> {
    await db.transaction("rw", db.notes, async () => {
      for (const note of notes) {
        await this.upsertFromRemote(note);
      }
    });
  },

  async updateNoteLocally(
    id: string,
    updates: Partial<LocalNote>,
  ): Promise<void> {
    await db.notes.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
      syncStatus: "pending",
    });
  },

  async markNotesSynced(ids: string[]): Promise<void> {
    const updates = ids.map((id) => ({
      key: id,
      changes: { syncStatus: "synced" } as Partial<LocalNote>,
    }));
    await db.notes.bulkUpdate(updates);
  },

  async markNoteDeletedAndSynced(id: string): Promise<void> {
    await db.notes.update(id, { syncStatus: "synced" });
  },

  async deleteLocalNotePermanently(id: string): Promise<void> {
    await db.notes.delete(id);
  },
};
