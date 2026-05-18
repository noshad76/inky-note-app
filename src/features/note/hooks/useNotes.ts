import { useLiveQuery } from "dexie-react-hooks";
import { LocalNoteService, RemoteNote } from "../service/LocalNote.service";
import { useNoteStore } from "../store/useNoteStore";
import { db } from "@/lib/db/db";
import { authStorage } from "@/lib/storage/auth-storage";
import { LocalNote } from "../types/notes";
import { useNotesSearchStore } from "../store/useNotesSearchStore";

export const useNotes = () => {
  const { activeNoteId, setActiveNoteId } = useNoteStore();
  const search = useNotesSearchStore((s) => s.search);
  const currentUserId =
    typeof window !== "undefined"
      ? (authStorage.getUser()?.id ?? "guest")
      : "guest";

  const notes = useLiveQuery(
    () => LocalNoteService.getActiveNotes(search),
    [search],
  );

  const activeNote = useLiveQuery(
    () => (activeNoteId ? db.notes.get(activeNoteId) : null),
    [activeNoteId],
  );

  return {
    notes: notes || [],
    activeNoteId,
    activeNote: activeNote || null,
    isLoading: notes === undefined,
    currentUserId,

    deleteNote: async (id: string) => {
      await LocalNoteService.deleteNote(id);
      if (activeNoteId === id) setActiveNoteId(null);
    },

    createNote: async (): Promise<LocalNote> => {
      const newNote = await LocalNoteService.createNote(currentUserId, "", "");
      setActiveNoteId(newNote.id);
      return newNote;
    },

    updateActiveNote: async (updates: {
      title?: string;
      content?: string;
    }): Promise<void> => {
      if (activeNoteId) {
        await LocalNoteService.updateNoteLocally(activeNoteId, updates);
      }
    },

    selectNote: (id: string | null) => setActiveNoteId(id),
  };
};
