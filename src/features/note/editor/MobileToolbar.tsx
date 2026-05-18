"use client";

import { Editor, useEditorState } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  ListChecks,
  Code2,
  Minus,
  Quote,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowLeftToLine,
  ArrowRightToLine,
} from "lucide-react";

interface MobileToolbarProps {
  editor: Editor | null;
}

export default function MobileToolbar({ editor }: MobileToolbarProps) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      highlight: editor.isActive("highlight"),
      h1: editor.isActive("heading", { level: 1 }),
      h2: editor.isActive("heading", { level: 2 }),
      bullet: editor.isActive("bulletList"),
      ordered: editor.isActive("orderedList"),
      task: editor.isActive("taskList"),
      code: editor.isActive("codeBlock"),
      blockquote: editor.isActive("blockquote"),
      isRtl: editor.isActive({ dir: "rtl" }),
      isLtr: editor.isActive({ dir: "ltr" }),
      alignLeft: editor.isActive({ textAlign: "left" }),
      alignCenter: editor.isActive({ textAlign: "center" }),
      alignRight: editor.isActive({ textAlign: "right" }),
    }),
  });

  if (!editor || !state) return null;

  const btn = "mobile-btn";
  const active = "mobile-btn active";

  return (
    <div className="mobile-toolbar md:hidden flex flex-nowrap items-center gap-1 p-2 bg-[var(--surface)] border-t border-[var(--border)] overflow-x-auto custom-scroll-h">
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className={btn}
      >
        <Undo2 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className={btn}
      >
        <Redo2 size={18} />
      </button>

      <div className="w-px h-6 bg-[var(--border)] mx-1 flex-shrink-0" />

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={state.bold ? active : btn}
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={state.italic ? active : btn}
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={state.underline ? active : btn}
      >
        <Underline size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={state.highlight ? active : btn}
      >
        <Highlighter size={18} />
      </button>

      <div className="w-px h-6 bg-[var(--border)] mx-1 flex-shrink-0" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={state.h1 ? active : btn}
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={state.h2 ? active : btn}
      >
        <Heading2 size={18} />
      </button>

      <div className="w-px h-6 bg-[var(--border)] mx-1 flex-shrink-0" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={state.bullet ? active : btn}
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={state.ordered ? active : btn}
      >
        <ListOrdered size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={state.task ? active : btn}
      >
        <ListChecks size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={state.blockquote ? active : btn}
      >
        <Quote size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={state.code ? active : btn}
      >
        <Code2 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btn}
      >
        <Minus size={18} />
      </button>

      <div className="w-px h-6 bg-[var(--border)] mx-1 flex-shrink-0" />

      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={state.alignLeft ? active : btn}
      >
        <AlignLeft size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={state.alignCenter ? active : btn}
      >
        <AlignCenter size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={state.alignRight ? active : btn}
      >
        <AlignRight size={18} />
      </button>

      <div className="w-px h-6 bg-[var(--border)] mx-1 flex-shrink-0" />

      <button
        onClick={() => editor.chain().focus().setTextDirection("rtl").run()}
        className={state.isRtl ? active : btn}
      >
        <ArrowRightToLine size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextDirection("ltr").run()}
        className={state.isLtr ? active : btn}
      >
        <ArrowLeftToLine size={18} />
      </button>
    </div>
  );
}
