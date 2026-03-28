import { Editor } from "primereact/editor";
import { useState } from "react";
import type { FormField } from "./FormCustom";

function RichText({
  field,
  initialValue,
  form,
}: {
  field: FormField;
  initialValue: string;
  form: any;
}) {
  const [content, setContent] = useState(initialValue);

  const toolbar = [
    ["bold", "italic", "underline", "strikeThrough"],
    ["superscript", "subscript"],
    ["alignLeft", "alignCenter", "alignRight", "alignJustify"],
    ["formatBlock", "blockquote"],
    ["removeFormat"],
    ["insertUnorderedList", "insertOrderedList", "outdent", "indent"],
    ["createLink", "unlink", "insertImage", "insertVideo", "insertTable"],
    ["undo", "redo", "print", "sourceCode"],
  ];

  return (
    <div className="p-field">
      <label htmlFor={field.name}>{field.label}</label>
      <Editor
        id={field.name}
        value={content}
        onTextChange={(e) => {
          setContent(e.htmlValue || "");
          form.setFieldsValue({ [field.name]: e.htmlValue || "" });
        }}
        style={{
          height: "500px",
          borderRadius: "10px",
          padding: "2px",
        }}
        headerTemplate={<div></div>}
        modules={{
          toolbar: toolbar,
        }}
      />
    </div>
  );
}

export default RichText;
