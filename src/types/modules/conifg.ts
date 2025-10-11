// 简中｜繁中｜英文
export type Lang = "ZH_CN" | "ZH_TW" | "EN_US";

// 侧边栏
export type Sidebar = {
  placement?: "left" | "right";
  visible?: boolean;
};

// 布局
export type Layout = {
  sidebar?: Sidebar;
};

// 主题模式
export type ThemeMode = "light" | "dark" | "system";

// 最终主题模式
export type ResolvedThemeMode = "light" | "dark";

// 主题
export type Theme = {
  color?: string;
  mode?: ThemeMode;
};

// 时钟
export type Clock = {
  show?: boolean; // 显示
  color?: string; // 颜色
  size?: number; // 大小
  bold?: boolean; // 粗体
  date?: boolean; // 日期
  second?: boolean; // 秒
  week?: boolean; // 星期
  hover24?: boolean; // 24小时制
  lunar?: boolean; // 农历
};

// 墙纸
export type Wallpaper = {
  type?: "color" | "picture" | "video";
  src?: string;
  auto?: boolean;
  overlay?: boolean;
  blur?: boolean;
};

// 搜索引擎单项
export type SearchEngineItem = {
  key?: string;
  title?: string;
  url?: string;
};

// 搜索引擎图标
export type SearchEngineIcon = {
  key?: string;
  url?: string;
};

// 搜索引擎
export type SearchEngine = {
  show?: boolean;
  use?: string;
  list?: SearchEngineItem[];
  history?: string[];
};

// 配置
export type Config = {
  lang?: Lang; // 语言
  theme?: Theme; // 主题
  layout?: Layout; // 布局
  clock?: Clock; // 时钟
  wallpaper?: Wallpaper; // 墙纸
  searchEngine?: SearchEngine; // 搜索引擎
};

// 配置触发器
export type ConfigAction = {
  // System
  resetConfig: () => void;

  // Lang
  getLang: () => Lang | undefined;
  setLang: (lang: Lang) => void;

  // Theme
  getTheme: () => Theme | undefined;
  setMode: (mode?: ThemeMode) => void;
  setTheme: (theme: Theme) => void;

  // Layout
  getLayout: () => Layout | undefined;
  setLayout: (layout: Layout) => void;

  // Sidebar
  getSidebar: () => Sidebar | undefined;
  setSidebar: (sidebar: Sidebar) => void;

  // Clock
  getClock: () => Clock | undefined;
  setClock: (clock: Clock) => void;

  // Wallpaper
  getWallpaper: () => Wallpaper | undefined;
  setWallpaper: (wallpaper: Wallpaper) => void;

  // Engine
  getEngine: () => SearchEngine | undefined;
  addEngine: (engine: SearchEngineItem) => void;
  setSearchVisible: (show: boolean) => void;
  setEngineUse: (key: SearchEngineItem["key"]) => void;
  setEngine: (engine: SearchEngineItem, add?: boolean) => void;
  removeEngine: (key: SearchEngineItem["key"]) => void;
};
