"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { EditorExtensions } from "./extentions";
import EditorToolbar from "./EditorToolbar";
import EditorBubbleMenu from "./EditorBubbleMenu";
import MobileToolbar from "./MobileToolbar";
import { useTranslations } from "next-intl";

interface EditorProps {
  content?: any;
  onChange?: (content: any) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const t = useTranslations("editor");
  const isUpdatingFromPropRef = useRef(false);

  const editor = useEditor({
    extensions: EditorExtensions(t("ContentPlaceholder")),
    immediatelyRender: false,
    content: content || {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    },

    editorProps: {
      attributes: {
        class: "prose max-w-none outline-none  min-h-[300px] px-4 ",
      },
    },

    onUpdate({ editor }) {
      // Skip onChange if we're updating from prop
      if (isUpdatingFromPropRef.current) {
        console.log("⏭️ Skipping onChange - updating from prop");
        return;
      }

      const json = editor.getJSON();
      console.log("✏️ Editor onUpdate - user edit");

      if (onChange) {
        onChange(json);
      }
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (!content) return;

    const current = editor.getJSON();

    if (JSON.stringify(current) !== JSON.stringify(content)) {
      console.log("📝 Editor: setting content from prop");
      isUpdatingFromPropRef.current = true;
      editor.commands.setContent(content);

      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingFromPropRef.current = false;
      }, 50);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="editor-container flex flex-col h-full">
      <div className="hidden sm:block">
        <EditorToolbar editor={editor} />
      </div>

      <EditorBubbleMenu editor={editor} />

      <div className=" custom-scroll overflow-y-auto">
        <EditorContent editor={editor} className="prose-container   " />
      </div>

      <div className="sm:hidden">
        <MobileToolbar editor={editor} />
      </div>
    </div>
  );
}
