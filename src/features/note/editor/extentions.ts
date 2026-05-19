import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Typography from "@tiptap/extension-typography";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Emoji from "@tiptap/extension-emoji";

import Heading from "@tiptap/extension-heading";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

import { TextStyle } from "@tiptap/extension-text-style";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { lowlight } from "./lowlight";
import { TextDirection } from "./text-direction";
import { Table } from "@tiptap/extension-table";

export const EditorExtensions = (placeholderText: string) => [
  StarterKit.configure({
    undoRedo: { depth: 50 },
    blockquote: false,
    horizontalRule: false,
    heading: false,
    underline: false,
    codeBlock: false,
  }),

  Placeholder.configure({
    placeholder: placeholderText,
    emptyEditorClass: "is-editor-empty",
    showOnlyWhenEditable: true,
  }),

  CodeBlockLowlight.configure({
    lowlight,
  }),

  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),

  TextStyle,
  Color,
  Typography,
  Underline,
  Highlight,
  Blockquote,
  HorizontalRule,

  Emoji.configure({
    enableEmoticons: true,
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: "inky-table",
    },
  }),
  TableRow,
  TableHeader,
  TableCell,
  CharacterCount.configure({
    limit: 100000,
  }),

  Heading.configure({
    levels: [1, 2, 3],
  }),

  TaskList.configure({
    HTMLAttributes: {
      class: "task-list",
    },
  }),

  TaskItem.configure({
    nested: true,
  }),
  TextDirection.configure({
    types: ["paragraph", "heading", "blockquote", "bulletList", "orderedList"],
  }),
];
