"use client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { syncNotes } from "../utils/syncNotes";

import { useMemo } from "react";
import { useNotesSearchStore } from "../store/useNotesSearchStore";
import { useLiveQuery } from "dexie-react-hooks";
import { LocalNoteService } from "../service/LocalNote.service";
export function useSyncNotes() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["notes-sync"],
    mutationFn: syncNotes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return {
    triggerSync: () => mutation.mutate(),
    isSyncing: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}

export function useNotesList(initialLimit = 20) {
  const search = useNotesSearchStore((s) => s.search);

  const liveNotes = useLiveQuery(() => LocalNoteService.getActiveNotes(), []);

  const filteredNotes = useMemo(() => {
    if (!liveNotes) return [];
    const searchTerm = search.trim().toLowerCase();
    if (!searchTerm) return liveNotes;

    return liveNotes.filter(
      (note) =>
        note.title?.toLowerCase().includes(searchTerm) ||
        note.content?.toLowerCase().includes(searchTerm),
    );
  }, [liveNotes, search]);

  return {
    notes: filteredNotes || [],
    isLoading: liveNotes === undefined,
  };
}
