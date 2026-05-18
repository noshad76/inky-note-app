import type { Editor } from "@tiptap/react";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export {};
