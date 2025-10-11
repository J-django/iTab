import Wallpaper from "@/layout/wallpaper";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="relative w-full h-full">
      <Scrollbars
        width="100%"
        height="100%"
        renderThumbVertical={({ style, ...props }) => (
          <div
            {...props}
            style={{ ...style }}
            className="bg-[var(--c-text-color-35)] hover:bg-[var(--c-text-color-45)] rounded-full transition-[background-color] duration-250 z-5"
          />
        )}
      >
        <Outlet />
      </Scrollbars>
      <Wallpaper />
    </div>
  );
};

export default Main;
