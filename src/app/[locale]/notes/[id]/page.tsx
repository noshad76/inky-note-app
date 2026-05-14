export default function NoteEditorPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Subject Area */}
      <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
        <input
          type="text"
          placeholder="Note Subject..."
          className="w-full text-3xl font-bold focus:outline-none bg-transparent"
        />
      </div>

      {/* Controllers (Toolbar) */}
      <div className="px-6 py-2 bg-neutral-50 dark:bg-neutral-800/50 flex gap-2">
        {/* دکمه‌های Bold, Italic, ... */}
        <div className="h-8 w-full bg-neutral-200/50 rounded animate-pulse" />
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="min-h-full outline-none" contentEditable />
      </div>
    </div>
  );
}
