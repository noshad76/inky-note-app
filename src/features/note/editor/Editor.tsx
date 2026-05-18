"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
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
      const json = editor.getJSON();

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
      editor.commands.setContent(content);
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
