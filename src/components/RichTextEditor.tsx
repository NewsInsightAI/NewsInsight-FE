"use client";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";
import { useDarkMode } from "@/context/DarkModeContext";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const { isDark } = useDarkMode();
  return (
    <div className="w-full">
      <ReactQuill
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Tulis konten di sini..."}
        className={`rounded-xl w-full ${isDark ? "quill-dark" : ""}`}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link", "blockquote"],
            ["clean"],
          ],
        }}
        theme="snow"
      />
    </div>
  );
}

type QuillDarkCSS = string;
const quillDarkCSS: QuillDarkCSS = `
.quill-dark .ql-toolbar {
  background: #23272f !important;
  border-color: #374151 !important;
}
.quill-dark .ql-container {
  background: #18181b !important;
  color: #e5e7eb !important;
  border-color: #374151 !important;
}
.quill-dark .ql-editor {
  background: #18181b !important;
  color: #e5e7eb !important;
  min-height: 150px !important;
}
.quill-dark .ql-editor.ql-blank::before {
  color: #9ca3af !important; /* Tailwind gray-400 */
  opacity: 1 !important;
}
.quill-dark .ql-picker {
  color: #e5e7eb !important;
}
.quill-dark .ql-stroke {
  stroke: #e5e7eb !important;
}
.quill-dark .ql-fill {
  fill: #e5e7eb !important;
}

/* Responsive styles for mobile */
@media (max-width: 768px) {
  .ql-toolbar {
    padding: 8px !important;
  }
  .ql-toolbar .ql-formats {
    margin-right: 8px !important;
  }
  .ql-editor {
    min-height: 120px !important;
    padding: 12px !important;
    font-size: 14px !important;
  }
  .ql-container {
    font-size: 14px !important;
  }
}

@media (max-width: 480px) {
  .ql-toolbar {
    padding: 6px !important;
    flex-wrap: wrap;
  }
  .ql-toolbar .ql-formats {
    margin-right: 6px !important;
    margin-bottom: 4px !important;
  }
  .ql-editor {
    min-height: 100px !important;
    padding: 10px !important;
    font-size: 13px !important;
  }
}
`;
if (
  typeof window !== "undefined" &&
  !document.getElementById("quill-dark-style")
) {
  const style = document.createElement("style");
  style.id = "quill-dark-style";
  style.innerHTML = quillDarkCSS;
  document.head.appendChild(style);
}
