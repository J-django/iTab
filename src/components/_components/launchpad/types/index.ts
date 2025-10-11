import type { ReactNode } from "react";
import type { Layout } from "react-grid-layout";
import { App } from "@/types";

export type LaunchpadLayouts = Record<string, Layout[]>;

export type LaunchpadCols = {
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
};

export type LaunchpadProps = {
  cols?: LaunchpadCols;
  initialApps?: App[];
  onChange?: (apps: App[], layout: Layout[]) => void;
  componentMap?: Record<string, ReactNode>;
};
