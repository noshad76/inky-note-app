import { create } from "zustand";

interface NotesSearchState {
  search: string;
  setSearch: (value: string) => void;
  clearSearch: () => void;
}

export const useNotesSearchStore = create<NotesSearchState>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),
  clearSearch: () => set({ search: "" }),
}));
