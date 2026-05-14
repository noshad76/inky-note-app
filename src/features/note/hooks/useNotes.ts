import { useLiveQuery } from "dexie-react-hooks";
import { LocalNoteService } from "../service/LocalNote.service";
import { useNoteStore } from "../store/useNoteStore";
import { db } from "@/lib/db/db";

export const useNotes = () => {
  const { activeNoteId, setActiveNoteId } = useNoteStore();

  const notes = useLiveQuery(() => LocalNoteService.getActiveNotes(), []);

  const activeNote = useLiveQuery(
    () => (activeNoteId ? db.notes.get(activeNoteId) : null),
    [activeNoteId],
  );

  return {
    notes: notes || [],
    activeNote,
    isLoading: notes === undefined,
    deleteNote: async (id: string) => {
      await LocalNoteService.deleteNote(id);
      if (activeNoteId === id) setActiveNoteId(null);
    },
    createNote: async (userId: string) => {
      const newNote = await LocalNoteService.createNote(userId, "", "");
      setActiveNoteId(newNote.id);
      return newNote;
    },

    updateActiveNote: async (updates: { title?: string; content?: string }) => {
      if (activeNoteId) {
        await LocalNoteService.updateNote(activeNoteId, updates);
      }
    },

    selectNote: (id: string) => setActiveNoteId(id),
  };
};
