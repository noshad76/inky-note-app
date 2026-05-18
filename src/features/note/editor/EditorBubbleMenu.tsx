"use client";

import { Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useEffect, useState } from "react";

import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  Code2,
  Link2,
  Unlink,
} from "lucide-react";

interface BubbleMenuProps {
  editor: Editor | null;
}

export default function EditorBubbleMenu({ editor }: BubbleMenuProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  if (!editor) return null;

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      highlight: editor.isActive("highlight"),
      code: editor.isActive("code"),
      link: editor.isActive("link"),
      hasSelection: editor.state.selection.content().size > 0,
    }),
  });

  useEffect(() => {
    const update = () => {
      const previousUrl = editor.getAttributes("link").href;
      setLinkUrl(previousUrl || "");
    };

    editor.on("selectionUpdate", update);
    return () => {
      editor.off("selectionUpdate", update);
    };
  }, [editor]);

  const setLink = () => {
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
  };

  const btn = "bubble-btn";
  const active = "bubble-btn active";

  return (
    <BubbleMenu
      editor={editor}
      options={{
        placement: "bottom",
      }}
      className="bubble-menu"
      shouldShow={() => state.hasSelection || state.link}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={state.bold ? active : btn}
      >
        <Bold size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={state.italic ? active : btn}
      >
        <Italic size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={state.underline ? active : btn}
      >
        <Underline size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={state.highlight ? active : btn}
      >
        <Highlighter size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={state.code ? active : btn}
      >
        <Code2 size={16} />
      </button>

      <button
        onClick={() => setShowLinkInput((p) => !p)}
        className={state.link ? active : btn}
      >
        <Link2 size={16} />
      </button>

      {state.link && (
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          className={btn}
        >
          <Unlink size={16} />
        </button>
      )}

      {showLinkInput && (
        <div className="flex items-center gap-1 ml-2">
          <input
            type="text"
            placeholder="https://"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="
              text-xs px-2 py-1 rounded
              bg-(--surface-muted)
              border border-(--border)
              text-(--text)
              outline-none
            "
          />

          <button
            onClick={setLink}
            className="text-xs px-2 py-1 rounded bg-(--primary) text-white"
          >
            Set
          </button>
        </div>
      )}
    </BubbleMenu>
  );
}
