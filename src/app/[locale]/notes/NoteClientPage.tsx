"use client";

import { useEffect, useMemo, useCallback } from "react";
import { debounce } from "lodash-es";
import Editor from "@/features/note/editor/Editor";
import EditorTitle from "@/features/note/editor/EditorTitle";
import { useNotes } from "@/features/note/hooks/useNotes";
import { useSyncNotes } from "@/features/note/hooks/useSyncNotes";
import { scheduleSync } from "@/features/note/utils/syncScheduler";

export default function Page({ noteId }: { noteId: string }) {
  const { activeNote, updateActiveNote, isLoading, selectNote } = useNotes();
  const { triggerSync } = useSyncNotes();

  useEffect(() => {
    if (noteId) {
      selectNote(noteId);
    }
  }, [noteId, selectNote]);

  const debouncedSave = useMemo(
    () =>
      debounce(
        async (id: string, updates: { title?: string; content?: string }) => {
          if (!id) return;
          await updateActiveNote(updates);
          scheduleSync(triggerSync);
          console.log("Saved to DB ✅");
        },
        1000,
      ),
    [updateActiveNote, triggerSync],
  );

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      if (!activeNote) return;
      debouncedSave(noteId, { title: newTitle });
    },
    [debouncedSave, noteId, activeNote],
  );

  const handleContentChange = useCallback(
    (newContent: any) => {
      if (!activeNote) return;
      debouncedSave(noteId, { content: newContent });
    },
    [debouncedSave, noteId, activeNote],
  );

  if (noteId === "index") {
    return <div></div>;
  }

  if (isLoading || (activeNote && activeNote.id !== noteId)) {
    return <div className="h-full w-full bg-transparent" />;
  }

  if (!activeNote) {
    return <div className=""></div>;
  }

  return (
    <div className="flex flex-col h-full min-h-0 pt-10">
      <div key={noteId} className="flex flex-col h-full">
        <EditorTitle value={activeNote.title} onChange={handleTitleChange} />

        <div className="flex-1 min-h-0">
          <Editor content={activeNote.content} onChange={handleContentChange} />
        </div>
      </div>
    </div>
  );
}
