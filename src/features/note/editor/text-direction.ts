import { Extension } from "@tiptap/core";

export const TextDirection = Extension.create({
  addGlobalAttributes() {
    return [
      {
        types: [
          "paragraph",
          "heading",
          "blockquote",
          "bulletList",
          "orderedList",
          "listItem",
          "taskList",
        ],
        attributes: {
          dir: {
            default: null,
            parseHTML: (element) => element.getAttribute("dir"),
            renderHTML: (attributes) => {
              if (!attributes.dir) return {};
              return { dir: attributes.dir };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTextDirection:
        (direction: "rtl" | "ltr") =>
        ({ state, dispatch }) => {
          const { selection, tr } = state;
          const { from, to } = selection;

          state.doc.nodesBetween(from, to, (node, pos) => {
            const nodeType = node.type.name;

            const types = [
              "paragraph",
              "heading",
              "blockquote",
              "bulletList",
              "orderedList",
              "listItem",
              "taskList",
            ];

            if (types.includes(nodeType)) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                dir: direction,
              });
            }
          });

          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    textDirection: {
      setTextDirection: (direction: "rtl" | "ltr") => ReturnType;
    };
  }
}
