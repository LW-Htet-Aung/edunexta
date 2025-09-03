"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menubar";
import TextAlign from "@tiptap/extension-text-align";
import { ControllerRenderProps } from "react-hook-form";
import { CourseSchemaType } from "@/lib/zodSchemas";

interface RichTextEditorProps {
  field: ControllerRenderProps<CourseSchemaType>;
}
const RichTextEditor = ({ field }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm  sm:prose lg:prose-lg xl:prose-xl min-h-[300px] p-4 focus:outline-none dark:prose-invert !w-full !max-w-none",
      },
    },
    content: field.value
      ? JSON.parse(field.value as string)
      : ` <p>Hello World 🌏</p>`,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
  });

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
