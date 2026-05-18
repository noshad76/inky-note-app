"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface TitleProps {
  value?: string;
  onChange?: (title: string) => void;
}

export default function EditorTitle({ value, onChange }: TitleProps) {
  const [title, setTitle] = useState(value || "");
  const t = useTranslations("editor");
  useEffect(() => {
    if (value !== undefined) {
      setTitle(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (onChange) onChange(newTitle);
  };

  return (
    <input
      type="text"
      value={title}
      onChange={handleChange}
      placeholder={t("TitlePlaceholder")}
      className="editor-title  px-4"
    />
  );
}
