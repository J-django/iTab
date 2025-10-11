import type { App } from "@/types";

export type Nav = {
  id: string;
  icon: string;
  name: string;
  children?: App[];
};

export type NavAction = {
  addNav: (nav: Nav) => void;
  getNavs: () => Nav[];
  setNavs: (navs: Nav[]) => void;
  updateNav: (nav: Nav) => void;
  updateAllNav: (nav: Nav[]) => void;
  deleteNav: (id: Nav["id"]) => void;
  clearAllNav: () => void;
  resetNav: () => void;
};
