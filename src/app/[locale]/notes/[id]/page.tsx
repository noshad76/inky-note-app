"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { debounce } from "lodash-es";
import Editor from "@/features/note/editor/Editor";
import EditorTitle from "@/features/note/editor/EditorTitle";
import { useNotes } from "@/features/note/hooks/useNotes";
import { useSyncNotes } from "@/features/note/hooks/useSyncNotes";
import { scheduleSync } from "@/features/note/utils/syncScheduler";

export default function Page() {
  const params = useParams();
  const noteId = params.id as string;
  const { activeNote, updateActiveNote, isLoading, selectNote } = useNotes();
  const { triggerSync } = useSyncNotes();
  useEffect(() => {
    if (noteId) {
      selectNote(noteId);
    }
  }, [noteId, selectNote]);

  const [noteData, setNoteData] = useState<{ title: string; content: any }>({
    title: "",
    content: null,
  });

  useEffect(() => {
    if (activeNote && activeNote.id === noteId) {
      setNoteData({
        title: activeNote.title || "",
        content: activeNote.content,
      });
    }
  }, [activeNote, noteId]);

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
    [updateActiveNote],
  );

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setNoteData((prev) => ({ ...prev, title: newTitle }));
      debouncedSave(noteId, { title: newTitle });
    },
    [debouncedSave, noteId],
  );

  const handleContentChange = useCallback(
    (newContent: any) => {
      setNoteData((prev) => ({ ...prev, content: newContent }));
      debouncedSave(noteId, { content: newContent });
    },
    [debouncedSave, noteId],
  );

  if (isLoading || (activeNote && activeNote.id !== noteId)) {
    return <div className="h-full w-full bg-transparent" />;
  }

  if (!activeNote && !isLoading) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        یادداشت مورد نظر یافت نشد.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 pt-10">
      <div key={noteId} className="flex flex-col h-full">
        <EditorTitle value={noteData.title} onChange={handleTitleChange} />

        <div className="flex-1 min-h-0">
          <Editor content={noteData.content} onChange={handleContentChange} />
        </div>
      </div>
    </div>
  );
}
