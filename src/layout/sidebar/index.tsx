import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { SettingNav } from "@/components/_components/setting-nav";
import { Image } from "@/components/image";
import { AnimatePresence, motion } from "framer-motion";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useConfigStore, useNavStore } from "@/store";
import { bus } from "@/utils";
import { clsx } from "clsx";

import type { Nav } from "@/types";

// 侧边栏
const Sidebar = () => {
  // State
  const [checkNav, setCheckNav] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Hooks
  const { getSidebar } = useConfigStore();
  const { navs, addNav, setNavs } = useNavStore();

  const placement = getSidebar()?.placement;

  // Func
  const handleNavClick = (navId: string) => {
    // 如果正在拖拽，不触发点击
    if (isDragging) return;
    setCheckNav(navId);
    bus.emit("NAV_CHANGE", navId);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    // 如果没有拖拽到有效位置，直接返回
    if (!result.destination) {
      setIsDragging(false);
      return;
    }

    // 如果拖拽位置没有变化，直接返回
    if (result.source.index === result.destination.index) {
      setIsDragging(false);
      return;
    }

    // 重新排序
    const ordered = Array.from(navs);
    const [removed] = ordered.splice(result.source.index, 1);
    ordered.splice(result.destination.index, 0, removed);
    setNavs(ordered);
    
    // 延迟重置拖拽状态，让点击事件先执行
    setTimeout(() => setIsDragging(false), 0);
  };

  useEffect(() => {
    if (navs?.[0]?.id) {
      setCheckNav(navs[0].id);
    }
  }, [navs]);

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
                    {/*Nav 列表*/}
                    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                      <Droppable droppableId="nav-list">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            {navs?.map((nav: Nav, index: number) => (
                              <Draggable key={nav.id} draggableId={String(nav.id)} index={index}>
                                {(provided, snapshot) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                    className={clsx(
                                      "w-12.5! overflow-hidden transition-all",
                                      snapshot.isDragging && "opacity-50",
                                    )}
                                  >
                                    <div
                                      className={clsx(
                                        "parent shrink-0 space-y-0.25 w-full h-12.5 flex flex-col items-center justify-center cursor-pointer transition-colors duration-250 cursor-grab active:cursor-grabbing",
                                        {
                                          "text-#dfdfd7 bg-#ffffff/15":
                                            checkNav === nav.id,
                                        },
                                      )}
                                      title={`${nav.name} - 点击切换，拖动调整顺序`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavClick(nav.id);
                                      }}
                                      onContextMenu={(e) => e.preventDefault()}
                                    >
                                      <div
                                        className={clsx(
                                          "shrink-0 w-5.5 h-5.5 parent-hover:scale-120 transition-transform duration-250 pointer-events-none",
                                          nav.icon,
                                        )}
                                      />
                                      <span className="text-2.75 max-w-full leading-normal select-none truncate pointer-events-none">
                                        {nav.name}
                                      </span>
                                    </div>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>

                    {/*新增 Nav 分组*/}
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
