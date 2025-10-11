import type { ReactNode } from "react";
import type { PopoverProps } from "antd";
import type { Nav } from "@/types";

export type SettingNavProps = {
  children: ReactNode;
  trigger?: PopoverProps["trigger"];
  placement?: PopoverProps["placement"];
  onOk: (nav: Nav) => void;
};

export type IconProps = {
  icon: string;
  checked: boolean;
  onClick: (icon: string) => void;
};
