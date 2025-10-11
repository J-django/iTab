import { orDefault } from "@/utils";

import type { Layout } from "react-grid-layout";
import { App, AppSize } from "@/types";
import { LaunchpadCols } from "../types";

export const BASE_SIZE = 60;

export const BASE_GAP = 10;

export function getGridSize(size?: AppSize) {
  switch (size) {
    case "1x1":
      return { w: 1, h: 1 };
    case "1x2":
      return { w: 1, h: 2 };
    case "2x1":
      return { w: 2, h: 1 };
    case "2x2":
      return { w: 2, h: 2 };
    case "2x4":
      return { w: 2, h: 4 };
    default:
      return { w: 1, h: 1 };
  }
}

export function generateLayouts(apps: App[], colsMap: LaunchpadCols) {
  const layouts: Record<string, Layout[]> = {};

  Object.keys(colsMap).forEach((bp) => {
    const key = bp as keyof LaunchpadCols;
    const cols = colsMap[key];
    layouts[bp] = apps.map((app, index) => {
      const { w, h } = getGridSize(app.size);
      const x = index % orDefault(cols, 0);
      const y = Math.floor(index / orDefault(cols, 0));
      return { i: app.id, x, y, w, h, isResizable: false };
    });
  });

  return layouts;
}
