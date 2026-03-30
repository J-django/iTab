import { useState, useEffect } from "react";
import { Clock } from "@/components/_components/clock";
import { Search } from "@/components/_components/search";
import { AppGrid } from "@/components/app-grid";
import { useNavStore } from "@/store";
import { bus } from "@/utils";
import type { App } from "@/types";

const Home = () => {
  const { navs, updateNav } = useNavStore();
  const [currentNavId, setCurrentNavId] = useState<string>("");

  useEffect(() => {
    if (!navs[0]?.id) {
      setCurrentNavId("");
      return;
    }

    const currentNavExists = navs.some((nav) => nav.id === currentNavId);
    if (!currentNavId || !currentNavExists) {
      setCurrentNavId(navs[0].id);
    }
  }, [navs, currentNavId]);

  useEffect(() => {
    const handler = (navId: string) => setCurrentNavId(navId);
    bus.on("NAV_CHANGE", handler);
    return () => bus.off("NAV_CHANGE", handler);
  }, []);

  const currentNav = navs.find((n) => n.id === currentNavId);
  const apps: App[] = currentNav?.children || [];

  const handleAppsChange = (newApps: App[]) => {
    if (currentNav) {
      updateNav({ ...currentNav, children: newApps });
    }
  };

  return (
    <div className="pl-25 pr-13 py-10 w-full min-h-full">
      {/*时间*/}
      <Clock />

      {/*查询*/}
      <Search />

      {/*应用网格*/}
      <AppGrid key={currentNavId} apps={apps} onChange={handleAppsChange} />
    </div>
  );
};

export default Home;
