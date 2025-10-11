export type AppType = "component" | "icon" | "folder";

export type AppSize = "1x1" | "1x2" | "2x1" | "2x2" | "2x4";

export type App = {
  id: string; // 编号
  name: string; // 名称
  logo: string; // 图标
  url: string; // 地址
  background: string; // 背景
  size?: AppSize; // 大小
  type?: AppType; // 类型
  component?: string; // 组件
  children?: App[]; // 子应用
};
