import { useRef, useState, useEffect } from "react";
import GridLayout, { WidthProvider } from "react-grid-layout";
import { SettingNav } from "@/components/_components/setting-nav";
import { Image } from "@/components/image";
import { AnimatePresence, motion } from "framer-motion";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useConfigStore, useNavStore } from "@/store";
import { bus } from "@/utils";
import { clsx } from "clsx";

import type { Nav } from "@/types";

const RGL = WidthProvider(GridLayout);

// 侧边栏
const Sidebar = () => {
  // Ref
  const isFirstRender = useRef(true);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  // State
  const [checkNav, setCheckNav] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Hooks
  const { getSidebar } = useConfigStore();
  const { navs, addNav, setNavs } = useNavStore();

  const placement = getSidebar()?.placement;

  // Func
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleNavClick = (navId: string) => {
    // 如果正在拖拽，不触发点击
    if (isDragging) return;
    setCheckNav(navId);
    bus.emit("NAV_CHANGE", navId);
  };

  function handleDragStart(e: any) {
    // 记录拖拽开始位置
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  }

  function handleDragStop(e: any) {
    // 计算拖拽距离
    if (dragStartPos.current && e) {
      const deltaX = Math.abs(e.clientX - dragStartPos.current.x);
      const deltaY = Math.abs(e.clientY - dragStartPos.current.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // 如果拖拽距离很小（小于 5 像素），视为点击，不触发拖拽
      if (distance < 5) {
        setIsDragging(false);
        dragStartPos.current = null;
        return;
      }
    }
    
    // 拖拽结束，重置状态
    setTimeout(() => {
      setIsDragging(false);
      dragStartPos.current = null;
    }, 0);
  }

  useEffect(() => {
    isFirstRender.current = false;
    setCheckNav(navs?.[0]?.id);
  }, []);

  return (
    <AnimatePresence>
      {getSidebar()?.visible && (
        <>
          <motion.div
            className={clsx(
              "absolute top-0 bottom-0 w-12.5 bg-[--c-bg-color-35] backdrop-blur-3 pointer-events-none transition-[background-color] z-10",
              {
                "left-0": placement === "left",
                "right-0": placement === "right",
              },
            )}
            initial={{ opacity: 0, x: placement === "left" ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: placement === "left" ? -10 : 10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="w-full h-full flex flex-col flex-wrap pointer-events-auto">
              {/*Logo*/}
              <div className="space-y-1.5 py-3 text-#ffffff/60 hover:text-#ffffff w-full flex flex-col items-center justify-center cursor-pointer transition-colors duration-250">
                <Image
                  className="shrink-0 w-7.5 h-7.5 bg-#f5f5f5 pointer-events-none"
                  rounded={true}
                />
                <span className="text-2.75 leading-none">登录</span>
              </div>

              {/*Nav*/}
              <div className="w-full flex-auto">
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
                  <ul className="m-0 p-0 list-none text-#ffffff/60">
                    {/*Nav列表*/}
                    <AnimatePresence>
                      <RGL
                        className="sidebar-grid-layout"
                        layout={navs.map((nav, i) => ({
                          i: String(nav.id),
                          x: 0,
                          y: i,
                          w: 1,
                          h: 1,
                        }))}
                        cols={1}
                        rowHeight={50}
                        width={50}
                        margin={[0, 0]}
                        containerPadding={[0, 0]}
                        isResizable={false}
                        isBounded={true}
                        onDragStart={handleDragStart}
                        onDragStop={handleDragStop}
                        onLayoutChange={(newLayout) => {
                          const ordered = newLayout
                            .sort((a, b) => (a.y ?? 0) - (b.y ?? 0))
                            .map((l) => navs.find((n) => String(n.id) === l.i)!)
                            .filter(Boolean);
                          setNavs(ordered);
                        }}
                      >
                        {navs?.map((nav: Nav) => (
                          <li
                            key={nav.id}
                            className="w-12.5! overflow-hidden pointer-events-none transition-[top]"
                          >
                            <div
                              className={clsx(
                                "parent shrink-0 space-y-0.25 w-full h-12.5 flex flex-col items-center justify-center cursor-pointer pointer-events-auto transition-colors duration-250",
                                {
                                  "text-#dfdfd7 bg-#ffffff/15":
                                    checkNav === nav.id,
                                },
                              )}
                              title={`${nav.name} - 点击切换，拖动调整顺序`}
                              onClick={() => handleNavClick(nav.id)}
                              onContextMenu={(e) => e.preventDefault()}
                            >
                              <div
                                className={clsx(
                                  "shrink-0 w-5.5 h-5.5 parent-hover:scale-120 transition-transform duration-250",
                                  nav.icon,
                                )}
                              />
                              <span className="text-2.75 max-w-full leading-normal select-none truncate">
                                {nav.name}
                              </span>
                            </div>
                          </li>
                        ))}
                      </RGL>
                    </AnimatePresence>

                    {/*新增Nav分组*/}
                    <SettingNav trigger="click" placement="right" onOk={addNav}>
                      <li
                        className="parent h-12.5 flex flex-col items-center justify-center cursor-pointer"
                        title="新增"
                      >
                        <div className="i-material-symbols:add-rounded shrink-0 w-6.5 h-6.5 parent-hover:scale-120 transition-transform duration-250"></div>
                      </li>
                    </SettingNav>
                  </ul>
                </Scrollbars>
              </div>

              {/*设置*/}
              <div
                className="parent py-3 w-full h-12.5 flex items-center justify-center cursor-pointer"
                onClick={() => bus.emit("OPEN_SETTING")}
              >
                <div className="i-solar:settings-linear w-5 h-5 text-#ffffff/60 tranistion-transform duration-500 parent-hover:rotate-180"></div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
