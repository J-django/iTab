import Main from "./main";
import Sidebar from "./sidebar";
import { SettingConfig } from "@/components/_components/setting-config";
import { useThemeEffect } from "@/hooks";

const Layout = () => {
  // Hooks
  useThemeEffect();

  return (
    <div className="relative w-full h-full">
      <Sidebar />
      <Main />

      {/*设置*/}
      <SettingConfig />
    </div>
  );
};

export default Layout;
