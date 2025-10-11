import { loadImg } from "../../utils";

import type { ThemeMode } from "@/types";

export const themes: { name: ThemeMode; title: string; image: string }[] = [
  { name: "light", title: "浅色主题", image: loadImg("light.png") },
  { name: "dark", title: "深色主题", image: loadImg("dark.png") },
  { name: "system", title: "跟随系统", image: loadImg("system.png") },
];
