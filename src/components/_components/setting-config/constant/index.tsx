import { lazy } from "react";
import { ComponentEnum } from "../types";

import type { ComponentType } from "react";
import type { SettingTab, ComponentMap } from "../types";

export const settingTabs: SettingTab[] = [
  {
    name: ComponentEnum.Search,
    title: "搜索栏",
    icon: <div className="i-lucide:search w-5 h-5"></div>,
  },
  {
    name: ComponentEnum.Clock,
    title: "时间/日期",
    icon: <div className="i-ic:round-access-alarms w-5 h-5"></div>,
  },
  {
    name: ComponentEnum.Theme,
    title: "主题",
    icon: <div className="i-ri:color-filter-ai-line w-5 h-5"></div>,
  },
  {
    name: ComponentEnum.Wallpaper,
    title: "墙纸",
    icon: <div className="i-ic:round-wallpaper w-5 h-5"></div>,
  },
  {
    name: ComponentEnum.Layout,
    title: "布局",
    icon: <div className="i-tabler:layout-sidebar w-5 h-5"></div>,
  },
  {
    name: ComponentEnum.Data,
    title: "数据中心",
    icon: <div className="i-tabler:database-cog w-5 h-5"></div>,
  },
  {
    name: ComponentEnum.Reset,
    title: "重置设置",
    icon: <div className="i-mingcute:refresh-2-line w-5 h-5"></div>,
  },
  {
    name: ComponentEnum.About,
    title: "关于",
    icon: <div className="i-lucide:notebook w-5 h-5"></div>,
  },
];

export function lazyWithDelay<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  delay: number = 1000, // 默认延迟 1s
) {
  return lazy(() =>
    Promise.all([
      factory(),
      new Promise((resolve) => setTimeout(resolve, delay)),
    ]).then(([module]) => module),
  );
}

export const settingComponents: ComponentMap = {
  [ComponentEnum.About]: lazy(() => import("../components/about/index")),
  [ComponentEnum.Clock]: lazy(() => import("../components/clock/index")),
  [ComponentEnum.Data]: lazy(() => import("../components/data/index")),
  [ComponentEnum.Layout]: lazy(() => import("../components/layout/index")),
  [ComponentEnum.Reset]: lazy(() => import("../components/reset/index")),
  [ComponentEnum.Search]: lazy(() => import("../components/search/index")),
  [ComponentEnum.Theme]: lazy(() => import("../components/theme/index")),
  [ComponentEnum.Wallpaper]: lazy(
    () => import("../components/wallpaper/index"),
  ),
};
