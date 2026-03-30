import { useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { Mode, createJSONEditor, toTextContent } from "vanilla-jsoneditor";
import "../styles/index.less";

import type { Content } from "vanilla-jsoneditor";
import type { JsonEditorProps } from "../types";

function parseJsonText(value: string) {
  if (!value.trim()) {
    return {
      valid: false,
      json: undefined,
    };
  }

  try {
    return {
      valid: true,
      json: JSON.parse(value) as unknown,
    };
  } catch {
    return {
      valid: false,
      json: undefined,
    };
  }
}

function getInitialMode(value: string) {
  return parseJsonText(value).valid ? Mode.tree : Mode.text;
}

export const JsonEditor = ({
  value,
  placeholderText,
  theme,
  onChange,
}: JsonEditorProps) => {
  const editorRootRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<ReturnType<typeof createJSONEditor> | null>(null);
  const onChangeRef = useRef(onChange);
  const [mode, setMode] = useState<Mode>(() => getInitialMode(value));
  const parsedJson = useMemo(() => parseJsonText(value), [value]);
  const canUseStructuredMode = parsedJson.valid;
  const effectiveMode =
    mode !== Mode.text && !canUseStructuredMode ? Mode.text : mode;
  const content = useMemo<Content>(() => {
    if (effectiveMode === Mode.text) {
      return { text: value };
    }

    return { json: parsedJson.json };
  }, [effectiveMode, parsedJson.json, value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!canUseStructuredMode && mode !== Mode.text) {
      setMode(Mode.text);
    }
  }, [canUseStructuredMode, mode]);

  useEffect(() => {
    if (!editorRootRef.current || editorRef.current) {
      return;
    }

    editorRef.current = createJSONEditor({
      target: editorRootRef.current,
      props: {},
    });

    return () => {
      void editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.updateProps({
      content,
      mode: effectiveMode,
      indentation: 2,
      tabSize: 2,
      mainMenuBar: false,
      navigationBar: effectiveMode !== Mode.text,
      statusBar: false,
      askToFormat: false,
      onChange: (updatedContent) => {
        onChangeRef.current(toTextContent(updatedContent, 2).text);
      },
      onChangeMode: (nextMode) => {
        setMode(nextMode);
      },
    });
  }, [content, effectiveMode]);

  return (
    <div
      className={clsx("json-editor-shell", {
        "is-dark": theme === "dark",
        "has-line-numbers": effectiveMode === Mode.text,
      })}
    >
      <div className="json-editor-surface">
        {!value && effectiveMode === Mode.text && (
          <div className="json-editor-placeholder">{placeholderText}</div>
        )}
        <div
          ref={editorRootRef}
          className={clsx("json-editor-host", {
            "jse-theme-dark": theme === "dark",
          })}
        />
      </div>
    </div>
  );
};
