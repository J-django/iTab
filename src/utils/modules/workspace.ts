import { NavList, defaultConfig } from "../../constant";

import type {
  App,
  AppSize,
  AppType,
  Config,
  Nav,
  SearchEngineItem,
  ThemeMode,
} from "../../types";
import { generateId } from "./id";

export type WorkspaceSnapshot = {
  version: number;
  appName: string;
  exportedAt: string;
  config: Config;
  navs: Nav[];
};

const DEFAULT_NAV_ICON = "i-akar-icons:home";
const DEFAULT_APP_BG = "#5d7df3";
const DEFAULT_FOLDER_BG = "#8796ad";
const MAX_SEARCH_HISTORY = 12;

const VALID_APP_SIZES = new Set<AppSize>(["1x1", "1x2", "2x1", "2x2", "2x4"]);
const VALID_LANGS = new Set(["ZH_CN", "ZH_TW", "EN_US"]);
const VALID_THEME_MODES = new Set(["light", "dark", "system"]);
const VALID_WALLPAPER_TYPES = new Set(["color", "picture", "video"]);
const VALID_SIDEBAR_PLACEMENTS = new Set(["left", "right"]);

const defaultTheme = defaultConfig.theme!;
const defaultLayout = defaultConfig.layout!;
const defaultSidebar = defaultLayout.sidebar!;
const defaultWallpaper = defaultConfig.wallpaper!;
const defaultClock = defaultConfig.clock!;
const defaultSearchEngine = defaultConfig.searchEngine!;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function getBoolean(value: unknown, fallback: boolean | undefined) {
  return typeof value === "boolean" ? value : fallback;
}

function getNumber(value: unknown, fallback: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function uniqueStrings(values: unknown, limit = MAX_SEARCH_HISTORY) {
  if (!Array.isArray(values)) {
    return [];
  }

  const nextValues = values
    .map((value) => getString(value).trim())
    .filter(Boolean);

  return Array.from(new Set(nextValues)).slice(0, limit);
}

function normalizeSearchEngineItem(input: unknown): SearchEngineItem | null {
  if (!isRecord(input)) {
    return null;
  }

  const key = getString(input.key).trim();
  const title = getString(input.title).trim();
  const url = getString(input.url).trim();

  if (!key || !title || !url) {
    return null;
  }

  return { key, title, url };
}

function normalizeApp(input: unknown): App | null {
  if (!isRecord(input)) {
    return null;
  }

  const name = getString(input.name).trim();
  if (!name) {
    return null;
  }

  const children = Array.isArray(input.children)
    ? input.children
        .map((item) => normalizeApp(item))
        .filter((item): item is App => Boolean(item))
    : [];

  const rawType = getString(input.type).trim() as AppType;
  const type: AppType =
    rawType === "folder" || children.length > 0
      ? "folder"
      : rawType === "component"
        ? "component"
        : "icon";

  const rawSize = getString(input.size).trim() as AppSize;
  const size = VALID_APP_SIZES.has(rawSize) ? rawSize : "1x1";

  const nextApp: App = {
    id: getString(input.id).trim() || generateId(),
    name,
    logo: type === "folder" ? "" : getString(input.logo).trim(),
    url: type === "folder" ? "" : getString(input.url).trim(),
    background:
      getString(input.background).trim() ||
      (type === "folder" ? DEFAULT_FOLDER_BG : DEFAULT_APP_BG),
    type,
  };

  if (type !== "folder") {
    nextApp.size = size;
  }

  const component = getString(input.component).trim();
  if (component) {
    nextApp.component = component;
  }

  if (type === "folder") {
    nextApp.children = children;
  }

  return nextApp;
}

function normalizeNav(input: unknown, index: number): Nav | null {
  if (!isRecord(input)) {
    return null;
  }

  const children = Array.isArray(input.children)
    ? input.children
        .map((item) => normalizeApp(item))
        .filter((item): item is App => Boolean(item))
    : [];

  return {
    id: getString(input.id).trim() || generateId(),
    name: getString(input.name).trim() || `分类 ${index + 1}`,
    icon: getString(input.icon).trim() || DEFAULT_NAV_ICON,
    children,
  };
}

export function normalizeNavs(input: unknown) {
  const nextNavs = Array.isArray(input)
    ? input
        .map((item, index) => normalizeNav(item, index))
        .filter((item): item is Nav => Boolean(item))
    : [];

  if (nextNavs.length > 0) {
    return nextNavs;
  }

  return NavList.map((nav, index) => normalizeNav(nav, index)).filter(
    (item): item is Nav => Boolean(item),
  );
}

export function normalizeConfig(input: unknown): Config {
  const source = isRecord(input) ? input : {};
  const theme = isRecord(source.theme) ? source.theme : {};
  const layout = isRecord(source.layout) ? source.layout : {};
  const sidebar = isRecord(layout.sidebar) ? layout.sidebar : {};
  const wallpaper = isRecord(source.wallpaper) ? source.wallpaper : {};
  const clock = isRecord(source.clock) ? source.clock : {};
  const searchEngine = isRecord(source.searchEngine) ? source.searchEngine : {};

  const nextSearchList = Array.isArray(searchEngine.list)
    ? searchEngine.list
        .map((item) => normalizeSearchEngineItem(item))
        .filter((item): item is SearchEngineItem => Boolean(item))
    : [];
  const searchList =
    nextSearchList.length > 0
      ? nextSearchList
      : (defaultSearchEngine.list || []).map((item) => ({ ...item }));
  const requestedEngineKey = getString(searchEngine.use).trim();
  const resolvedEngineKey = searchList.some(
    (item) => item.key === requestedEngineKey,
  )
    ? requestedEngineKey
    : searchList[0]?.key;

  const lang = getString(source.lang).trim();
  const mode = getString(theme.mode).trim();
  const wallpaperType = getString(wallpaper.type).trim();
  const sidebarPlacement = getString(sidebar.placement).trim();

  return {
    ...defaultConfig,
    lang: VALID_LANGS.has(lang) ? (lang as Config["lang"]) : defaultConfig.lang,
    theme: {
      ...defaultTheme,
      color: getString(theme.color).trim() || defaultTheme.color,
      mode: VALID_THEME_MODES.has(mode)
        ? (mode as ThemeMode)
        : defaultTheme.mode,
    },
    layout: {
      ...defaultLayout,
      sidebar: {
        ...defaultSidebar,
        placement: VALID_SIDEBAR_PLACEMENTS.has(sidebarPlacement)
          ? (sidebarPlacement as "left" | "right")
          : defaultSidebar.placement,
        visible: getBoolean(sidebar.visible, defaultSidebar.visible),
      },
    },
    wallpaper: {
      ...defaultWallpaper,
      type: VALID_WALLPAPER_TYPES.has(wallpaperType)
        ? (wallpaperType as "color" | "picture" | "video")
        : defaultWallpaper.type,
      src: getString(wallpaper.src).trim() || defaultWallpaper.src,
      auto: getBoolean(wallpaper.auto, defaultWallpaper.auto),
      overlay: getBoolean(wallpaper.overlay, defaultWallpaper.overlay),
      blur: getBoolean(wallpaper.blur, defaultWallpaper.blur),
    },
    clock: {
      ...defaultClock,
      show: getBoolean(clock.show, defaultClock.show),
      color: getString(clock.color).trim() || defaultClock.color,
      size: getNumber(clock.size, defaultClock.size),
      bold: getBoolean(clock.bold, defaultClock.bold),
      date: getBoolean(clock.date, defaultClock.date),
      second: getBoolean(clock.second, defaultClock.second),
      week: getBoolean(clock.week, defaultClock.week),
      hover24: getBoolean(clock.hover24, defaultClock.hover24),
      lunar: getBoolean(clock.lunar, defaultClock.lunar),
    },
    searchEngine: {
      ...defaultSearchEngine,
      show: getBoolean(searchEngine.show, defaultSearchEngine.show),
      use: resolvedEngineKey,
      list: searchList,
      history: uniqueStrings(searchEngine.history),
    },
  };
}

export function createWorkspaceSnapshot(config: Config, navs: Nav[]) {
  return {
    version: 2,
    appName: import.meta.env.VITE_APP_NAME || "itab",
    exportedAt: new Date().toISOString(),
    config: normalizeConfig(config),
    navs: normalizeNavs(navs),
  } satisfies WorkspaceSnapshot;
}

export function parseWorkspaceSnapshot(input: string | unknown) {
  const parsed = typeof input === "string" ? JSON.parse(input) : input;

  if (!isRecord(parsed)) {
    throw new Error("无效的工作区数据");
  }

  return {
    version: getNumber(parsed.version, 1) || 1,
    appName:
      getString(parsed.appName).trim() ||
      import.meta.env.VITE_APP_NAME ||
      "itab",
    exportedAt: getString(parsed.exportedAt).trim() || new Date().toISOString(),
    config: normalizeConfig(parsed.config),
    navs: normalizeNavs(parsed.navs),
  } satisfies WorkspaceSnapshot;
}
