import { useEffect } from "react";
import { useConfigStore } from "@/store";
import { watchSystemTheme, applyTheme } from "@/utils";

export function useThemeEffect() {
  const { theme, setMode } = useConfigStore();

  useEffect(() => {
    let stopWatch: (() => void) | undefined;

    if (!theme?.mode) return;

    if (theme.mode === "system") {
      applyTheme(theme.mode);

      stopWatch = watchSystemTheme((resolvedTheme) => {
        setMode("system");
        applyTheme(resolvedTheme);
      });
    } else {
      applyTheme(theme.mode);
    }

    return () => stopWatch?.();
  }, [theme?.mode, setMode]);
}
