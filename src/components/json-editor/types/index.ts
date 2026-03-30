import type { ResolvedThemeMode } from "@/types";

export type JsonEditorProps = {
  value: string;
  placeholderText: string;
  theme: ResolvedThemeMode;
  onChange: (value: string) => void;
};
