"use client";

import { Editor, useEditorState } from "@tiptap/react";
import { useTranslations } from "next-intl";
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
  TableIcon,
  Columns,
  Rows,
  Trash2,
  Merge,
} from "lucide-react";
import { Tooltip } from "@/share/components/Tooltip";

interface ToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: ToolbarProps) {
  const t = useTranslations("editor.toolbar");

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
      isTable: editor.isActive("table"),
    }),
  });

  if (!editor || !state) return null;

  const btnClass = "editor-btn";
  const activeClass = "editor-btn active";

  const ToolbarButton = ({
    onClick,
    isActive = false,
    icon: Icon,
    label,
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    label: string;
  }) => (
    <Tooltip content={label}>
      <button
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={isActive ? activeClass : btnClass}
      >
        <Icon size={18} />
      </button>
    </Tooltip>
  );

  const Divider = () => (
    <div className="w-px h-6 bg-(--border-soft) mx-1 self-center" />
  );

  return (
    <div className="editor-toolbar hidden md:flex flex-wrap items-center gap-0.5 p-1">
      {/* History */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        icon={Undo2}
        label={t("undo")}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        icon={Redo2}
        label={t("redo")}
      />

      <Divider />

      {/* Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={state.bold}
        icon={Bold}
        label={t("bold")}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={state.italic}
        icon={Italic}
        label={t("italic")}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={state.underline}
        icon={Underline}
        label={t("underline")}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={state.highlight}
        icon={Highlighter}
        label={t("highlight")}
      />

      <Divider />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={state.h1}
        icon={Heading1}
        label={t("h1")}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={state.h2}
        icon={Heading2}
        label={t("h2")}
      />

      <Divider />

      {/* Lists & Blocks */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={state.bullet}
        icon={List}
        label={t("bulletList")}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={state.ordered}
        icon={ListOrdered}
        label={t("orderedList")}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={state.task}
        icon={ListChecks}
        label={t("taskList")}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={state.blockquote}
        icon={Quote}
        label={t("blockquote")}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={state.code}
        icon={Code2}
        label={t("codeBlock")}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={Minus}
        label={t("horizontalRule")}
      />

      <Divider />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={state.alignLeft}
        icon={AlignLeft}
        label={t("alignLeft")}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={state.alignCenter}
        icon={AlignCenter}
        label={t("alignCenter")}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={state.alignRight}
        icon={AlignRight}
        label={t("alignRight")}
      />

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextDirection("rtl").run()}
        isActive={state.isRtl}
        icon={ArrowRightToLine}
        label={t("rtl")}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextDirection("ltr").run()}
        isActive={state.isLtr}
        icon={ArrowLeftToLine}
        label={t("ltr")}
      />
      <Divider />
      <ToolbarButton
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
        icon={TableIcon}
        label={t("insertTable")}
      />

      {state.isTable && (
        <>
          <Divider />
          <ToolbarButton
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            icon={Columns}
            label={t("addColumn")}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().addRowAfter().run()}
            icon={Rows}
            label={t("addRow")}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().deleteTable().run()}
            icon={Trash2}
            label={t("deleteTable")}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().mergeCells().run()}
            icon={Merge}
            label={t("mergeCells")}
          />
        </>
      )}
    </div>
  );
}
