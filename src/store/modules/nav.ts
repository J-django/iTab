import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NavList } from "@/constant";
import type { Nav, NavAction } from "@/types";

type NavStore = { navs: Nav[] } & NavAction;

export const useNavStore = create(
  persist<NavStore>(
    (set, get) => ({
      // Navs
      navs: NavList,
      // 新增Nav
      addNav(nav: Nav) {
        set((state) => ({
          navs: [...state.navs, nav],
        }));
      },
      // 获取Nav
      getNavs: () => get().navs,
      // 设置Nav
      setNavs: (navs: Nav[]) => set({ navs }),
      // 更新Nav
      updateNav(nav: Nav) {
        set((state) => ({
          navs: state.navs.map((item) =>
            item.id === nav.id ? { ...item, ...nav } : item,
          ),
        }));
      },
      // 批量更新Nav
      updateAllNav(navs: Nav[]) {
        set((state) => {
          const navMap = new Map(state.navs.map((n) => [n.id, n]));
          navs.forEach((n) => {
            navMap.set(n.id, { ...navMap.get(n.id), ...n });
          });
          return { navs: Array.from(navMap.values()) };
        });
      },
      // 删除Nav
      deleteNav(id: Nav["id"]) {
        set((state) => ({
          navs: state.navs.filter((item) => item.id !== id),
        }));
      },
      // 清除所有Nav
      clearAllNav() {
        set({ navs: [] });
      },
      // 重置Nav
      resetNav: () => set({ navs: NavList }),
    }),
    { name: `${import.meta.env.VITE_APP_NAME}-NavStore` },
  ),
);
