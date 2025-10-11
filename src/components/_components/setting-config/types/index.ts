import type { JSX, LazyExoticComponent, ComponentType } from "react";

export enum ComponentEnum {
  About = "About",
  Clock = "Clock",
  Layout = "Layout",
  Reset = "Reset",
  Search = "Search",
  Theme = "Theme",
  Wallpaper = "Wallpaper",
}

export type SettingTab = {
  name: ComponentEnum;
  icon?: JSX.Element;
  title: string;
};

export type ComponentMap = Record<
  ComponentEnum,
  LazyExoticComponent<ComponentType<any>>
>;
