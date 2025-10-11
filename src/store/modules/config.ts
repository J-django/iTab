import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultConfig } from "@/constant";

import type {
  Config,
  ConfigAction,
  ThemeMode,
  Sidebar,
  SearchEngine,
  SearchEngineItem,
} from "@/types";

export type ConfigStore = Config & ConfigAction;

export const useConfigStore = create(
  persist<ConfigStore>(
    (set, get) => ({
      // 默认项
      ...defaultConfig,

      // System
      resetConfig: () => set(defaultConfig),

      // Lang
      getLang: () => get()?.lang,
      setLang: (lang: Config["lang"]) => set({ lang }),

      // Theme
      getTheme: () => get()?.theme,
      setMode(mode?: ThemeMode) {
        set({ theme: { ...get().theme, mode } });
      },
      setTheme(theme: Config["theme"]) {
        set({ theme: { ...get().theme, ...theme } });
      },

      // Layout
      getLayout: () => get()?.layout,
      setLayout(layout: Config["layout"]) {
        set({ layout: { ...get().layout, ...layout } });
      },

      // Sidebar
      getSidebar: () => get()?.layout?.sidebar,
      setSidebar(sidebar: Sidebar) {
        set({
          layout: {
            ...get().layout,
            sidebar: { ...get()?.layout?.sidebar, ...sidebar },
          },
        });
      },

      // Clock
      getClock: () => get().clock,
      setClock(clock: Config["clock"]) {
        const localClock = get().clock;
        set({ clock: { ...localClock, ...clock } });
      },

      // Wallpaper
      getWallpaper: () => get().wallpaper,
      setWallpaper(wallpaper: Config["wallpaper"]) {
        const localWallpaper = get().wallpaper;
        set({ wallpaper: { ...localWallpaper, ...wallpaper } });
      },

      // Engine
      getEngine: () => get()?.searchEngine,
      addEngine(engine: SearchEngineItem) {
        const localEngine = get()?.searchEngine;
        set({
          searchEngine: {
            ...localEngine,
            use: localEngine?.use ?? engine?.key,
            list: [...(localEngine?.list || []), engine],
          },
        });
      },
      setSearchVisible(show: SearchEngine["show"]) {
        const localEngine = get()?.searchEngine;
        set({
          searchEngine: {
            ...localEngine,
            show,
          },
        });
      },
      setEngineUse(key: SearchEngineItem["key"]) {
        const localEngine = get()?.searchEngine;
        set({
          searchEngine: {
            ...localEngine,
            use: key,
          },
        });
      },
      setEngine(engine: SearchEngineItem, add?: boolean) {
        const localEngine = get()?.searchEngine;
        if (!localEngine?.list) return;

        let found = false;
        const newList = localEngine.list.map((item) => {
          if (item.key === engine.key) {
            found = true;
            return { ...item, ...engine };
          }
          return item;
        });

        if (!found && add) {
          get().addEngine(engine);
          return;
        }

        set({
          searchEngine: {
            ...localEngine,
            list: newList,
          },
        });
      },
      removeEngine(key: SearchEngineItem["key"]) {
        const localEngine = get()?.searchEngine;
        if (!localEngine?.list) return;

        const newEngineList = localEngine.list.filter(
          (item) => item.key !== key,
        );

        let newUse = localEngine.use;

        if (localEngine.use === key) {
          if (newEngineList.length > 0) {
            const idx = localEngine.list.findIndex((item) => item.key === key);
            if (idx !== -1 && idx < localEngine.list.length - 1) {
              newUse = localEngine.list[idx + 1].key;
            } else {
              newUse = newEngineList[newEngineList.length - 1].key;
            }
          } else {
            newUse = undefined;
          }
        }

        set({
          searchEngine: {
            ...localEngine,
            use: newUse,
            list: newEngineList,
          },
        });
      },
    }),
    { name: `${import.meta.env.VITE_APP_NAME}-ConfigStore` },
  ),
);
