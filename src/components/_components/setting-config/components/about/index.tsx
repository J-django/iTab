import List from "@/components/list";
import { useConfigStore, useNavStore } from "@/store";

import type { Nav } from "@/types";

function countStats(navs: Nav[]) {
  let appCount = 0;
  let folderCount = 0;

  const visit = (items: NonNullable<Nav["children"]>) => {
    items.forEach((item) => {
      if (item.type === "folder") {
        folderCount += 1;
        visit(item.children || []);
        return;
      }

      appCount += 1;
    });
  };

  navs.forEach((nav) => visit(nav.children || []));

  return {
    navCount: navs.length,
    appCount,
    folderCount,
  };
}

const About = () => {
  const { theme, searchEngine } = useConfigStore();
  const { navs } = useNavStore();
  const currentEngine = searchEngine?.list?.find(
    (item) => item.key === searchEngine?.use,
  );
  const stats = countStats(navs);
  const themeTitleMap = {
    light: "浅色",
    dark: "深色",
    system: "跟随系统",
  } as const;

  return (
    <List>
      <List.Item title="版本号" content={import.meta.env.VITE_APP_VERSION} />

      <List.Item
        title="工作区"
        content={`${stats.navCount} 个分类 / ${stats.appCount} 个应用 / ${stats.folderCount} 个文件夹`}
      />

      <List.Item
        title="当前主题"
        content={`${themeTitleMap[theme?.mode || "system"]} / ${theme?.color?.toUpperCase() || "-"}`}
      />

      <List.Item
        title="默认搜索"
        content={`${currentEngine?.title || "未设置"} / ${searchEngine?.history?.length || 0} 条历史`}
      />

      <List.Item
        title="应用标识"
        content={import.meta.env.VITE_APP_NAME || "itab"}
      />
    </List>
  );
};

export default About;
