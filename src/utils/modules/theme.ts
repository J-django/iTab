import type { ThemeMode, ResolvedThemeMode } from "@/types";

/**
 * 获取当前系统主题
 */
export function getSystemTheme(): ResolvedThemeMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * 解析最终主题
 * @param mode 解析最终主题
 */
export function resolveTheme(mode: ThemeMode): ResolvedThemeMode {
  return mode === "system" ? getSystemTheme() : mode;
}

/**
 * 监听系统主题变化
 * @param callback 回调返回最终主题
 */
export function watchSystemTheme(callback: (theme: ResolvedThemeMode) => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? "dark" : "light");
  };

  mediaQuery.addEventListener("change", handler);

  return () => mediaQuery.removeEventListener("change", handler);
}

/**
 * 设置主题
 * @param mode 主题枚举
 */
export function applyTheme(mode: ThemeMode) {
  const theme = resolveTheme(mode);
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
}
