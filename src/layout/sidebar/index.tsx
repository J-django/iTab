import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
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

    // 保存拖拽前的选中状态
    const previousCheckNav = checkNav;

    // 重新排序
    const ordered = Array.from(navs);
    const [removed] = ordered.splice(result.source.index, 1);
    ordered.splice(result.destination.index, 0, removed);
    setNavs(ordered);

    // 恢复拖拽前的选中状态，不因为拖拽而改变选中
    setCheckNav(previousCheckNav);
    setIsDragging(false);
  };

  // 只在初始化时设置默认选中，不在 navs 变化时重置
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!checkNav && navs?.[0]?.id) {
      setCheckNav(navs[0].id);
    }
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
              <div className="w-full flex-auto flex flex-col">
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
                    <DragDropContext
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      <Droppable droppableId="nav-list" direction="vertical">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {navs?.map((nav: Nav, index: number) => (
                              <Draggable
                                key={nav.id}
                                draggableId={String(nav.id)}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                      // 拖拽时只允许纵向位移，锁定横向位置
                                      transform:
                                        snapshot.isDragging &&
                                        provided.draggableProps.style?.transform
                                          ? provided.draggableProps.style.transform.replace(
                                              /translate3d\(([^,]+),/,
                                              "translate3d(0,",
                                            )
                                          : provided.draggableProps.style
                                              ?.transform,
                                    }}
                                    className={clsx(
                                      "w-12.5! overflow-hidden",
                                      snapshot.isDragging && "opacity-80",
                                    )}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNavClick(nav.id);
                                    }}
                                    onContextMenu={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      className={clsx(
                                        "parent shrink-0 space-y-0.25 w-full h-12.5 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-250 border-2 border-transparent",
                                        snapshot.isDragging &&
                                          "bg-[var(--c-bg-color-25)] border-dashed border-white/50 shadow-lg scale-105",
                                        {
                                          "text-#dfdfd7 bg-#ffffff/15":
                                            checkNav === nav.id &&
                                            !snapshot.isDragging,
                                        },
                                      )}
                                      title={`${nav.name} - 点击切换，拖动调整顺序`}
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

                    {/*新增 Nav 分组 - 放在滚动条外面*/}
                    <SettingNav trigger="click" placement="right" onOk={addNav}>
                      <li
                        className="parent h-12.5 flex flex-col items-center justify-center cursor-pointer text-#ffffff/60 hover:text-#ffffff transition-colors duration-250"
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
