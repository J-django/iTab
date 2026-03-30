import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { createPortal } from "react-dom";
import { Button } from "@/components/button";
import { GlassSurface } from "@/components/glass-surface";
import { SettingNav } from "@/components/_components/setting-nav";
import { NavForm } from "@/components/_components/setting-nav";
import { Image } from "@/components/image";
import { AnimatePresence, motion } from "framer-motion";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useConfigStore, useNavStore } from "@/store";
import { useClickOutside } from "@/hooks";
import { bus } from "@/utils";
import { clsx } from "clsx";
import { toast } from "sonner";

import type { Nav } from "@/types";
import type { MouseEvent as ReactMouseEvent } from "react";

type NavContextMenuState = {
  visible: boolean;
  x: number;
  y: number;
  navId: string | null;
};

type FloatingPanelPosition = {
  x: number;
  y: number;
};

type NavAnchorRect = {
  top: number;
  right: number;
};

type NavContextAction = {
  key: string;
  label: string;
  danger?: boolean;
  disabled?: boolean;
  onSelect: () => void;
};

// 侧边栏
const Sidebar = () => {
  const contextMenuHeight = 92;
  const floatingOffset = 10;
  const editPanelWidth = 272;
  const editPanelHeight = 284;

  const [checkNav, setCheckNav] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [contextMenu, setContextMenu] = useState<NavContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    navId: null,
  });
  const [pendingDeleteNav, setPendingDeleteNav] = useState<Nav | null>(null);
  const [editingNav, setEditingNav] = useState<Nav | null>(null);
  const [editPanelPosition, setEditPanelPosition] =
    useState<FloatingPanelPosition>({
      x: 0,
      y: 0,
    });
  const [deletePanelPosition, setDeletePanelPosition] =
    useState<FloatingPanelPosition>({
      x: 0,
      y: 0,
    });
  const [navAnchorRect, setNavAnchorRect] = useState<NavAnchorRect | null>(
    null,
  );
  const editOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const editPanelRef = useRef<HTMLDivElement | null>(null);
  const deletePanelRef = useRef<HTMLDivElement | null>(null);

  const { getSidebar } = useConfigStore();
  const { navs, addNav, setNavs, deleteNav, updateNav } = useNavStore();

  const placement = getSidebar()?.placement;

  const closeContextMenu = useCallback(() => {
    setContextMenu((previous) =>
      previous.visible ? { visible: false, x: 0, y: 0, navId: null } : previous,
    );
  }, []);

  const closeNavOverlay = useCallback(() => {
    if (editOpenTimerRef.current) {
      clearTimeout(editOpenTimerRef.current);
      editOpenTimerRef.current = null;
    }
    closeContextMenu();
    setEditingNav(null);
    setPendingDeleteNav(null);
  }, [closeContextMenu]);

  useClickOutside([contextMenuRef, editPanelRef, deletePanelRef], () =>
    closeNavOverlay(),
  );

  useEffect(() => {
    if (!contextMenu.visible && !editingNav) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeNavOverlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeNavOverlay);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeNavOverlay);
    };
  }, [closeNavOverlay, contextMenu.visible, editingNav]);

  const handleNavClick = (navId: string) => {
    if (isDragging) return;
    closeNavOverlay();
    setCheckNav(navId);
    bus.emit("NAV_CHANGE", navId);
  };

  const handleDragStart = () => {
    closeNavOverlay();
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      setIsDragging(false);
      return;
    }

    if (result.source.index === result.destination.index) {
      setIsDragging(false);
      return;
    }

    const previousCheckNav = checkNav;

    const ordered = Array.from(navs);
    const [removed] = ordered.splice(result.source.index, 1);
    ordered.splice(result.destination.index, 0, removed);
    setNavs(ordered);

    setCheckNav(previousCheckNav);
    setIsDragging(false);
  };

  const contextMenuNav =
    navs.find((nav) => nav.id === contextMenu.navId) || null;

  const handleDeleteNav = useCallback(
    (nav: Nav) => {
      if (navs.length <= 1) {
        toast.error("至少保留一个分类");
        closeContextMenu();
        return;
      }

      const anchorRight = navAnchorRect?.right || contextMenu.x;
      const anchorTop = navAnchorRect?.top || contextMenu.y;

      setDeletePanelPosition({
        x: Math.min(
          anchorRight + floatingOffset,
          window.innerWidth - editPanelWidth - 8,
        ),
        y: Math.min(anchorTop, window.innerHeight - 182 - 8),
      });
      closeContextMenu();
      setPendingDeleteNav(nav);
    },
    [
      closeContextMenu,
      contextMenu.x,
      contextMenu.y,
      navAnchorRect,
      navs.length,
    ],
  );

  const handleConfirmDeleteNav = useCallback(() => {
    if (!pendingDeleteNav) {
      return;
    }

    const currentIndex = navs.findIndex(
      (item) => item.id === pendingDeleteNav.id,
    );
    const fallbackNav = navs[currentIndex + 1] || navs[currentIndex - 1];

    deleteNav(pendingDeleteNav.id);

    if (checkNav === pendingDeleteNav.id) {
      const fallbackNavId = fallbackNav?.id || "";
      setCheckNav(fallbackNavId);
      if (fallbackNavId) {
        bus.emit("NAV_CHANGE", fallbackNavId);
      }
    }

    toast.success("分类已删除");
    setPendingDeleteNav(null);
  }, [checkNav, deleteNav, navs, pendingDeleteNav]);

  const handleEditNav = useCallback(
    (nav: Nav) => {
      if (editOpenTimerRef.current) {
        clearTimeout(editOpenTimerRef.current);
      }

      const anchorRight = navAnchorRect?.right || contextMenu.x;
      const anchorTop = navAnchorRect?.top || contextMenu.y;

      setEditPanelPosition({
        x: Math.min(
          anchorRight + floatingOffset,
          window.innerWidth - editPanelWidth - 8,
        ),
        y: Math.min(anchorTop, window.innerHeight - editPanelHeight - 8),
      });
      closeContextMenu();
      editOpenTimerRef.current = setTimeout(() => {
        setEditingNav(nav);
        editOpenTimerRef.current = null;
      }, 80);
    },
    [closeContextMenu, contextMenu.x, contextMenu.y, navAnchorRect],
  );

  const handleSaveNavEdit = useCallback(
    (draft: { name: string; icon: string }) => {
      if (!editingNav) {
        return;
      }

      updateNav({
        ...editingNav,
        name: draft.name,
        icon: draft.icon,
      });
      setEditingNav(null);
      closeContextMenu();
      toast.success("分类已更新");
    },
    [closeContextMenu, editingNav, updateNav],
  );

  const navContextActions = useMemo<NavContextAction[]>(() => {
    if (!contextMenuNav) {
      return [];
    }

    return [
      {
        key: "edit",
        label: "编辑",
        onSelect: () => handleEditNav(contextMenuNav),
      },
      {
        key: "delete",
        label: "删除",
        danger: true,
        disabled: navs.length <= 1,
        onSelect: () => handleDeleteNav(contextMenuNav),
      },
    ];
  }, [contextMenuNav, handleDeleteNav, handleEditNav, navs.length]);

  const openNavContextMenu = (event: ReactMouseEvent, nav: Nav) => {
    event.preventDefault();
    event.stopPropagation();

    if (isDragging) {
      return;
    }

    const targetRect = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();

    if (editOpenTimerRef.current) {
      clearTimeout(editOpenTimerRef.current);
      editOpenTimerRef.current = null;
    }
    setEditingNav(null);
    setNavAnchorRect({
      top: targetRect.top,
      right: targetRect.right,
    });
    setContextMenu({
      visible: true,
      x: Math.min(
        targetRect.right + floatingOffset,
        window.innerWidth - 140 - 8,
      ),
      y: Math.min(targetRect.top, window.innerHeight - contextMenuHeight - 8),
      navId: nav.id,
    });
  };

  useEffect(() => {
    return () => {
      if (editOpenTimerRef.current) {
        clearTimeout(editOpenTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!navs?.length) {
      if (checkNav) {
        setCheckNav("");
      }
      setPendingDeleteNav(null);
      setEditingNav(null);
      setDeletePanelPosition({ x: 0, y: 0 });
      setNavAnchorRect(null);
      return;
    }

    const currentNavExists = navs.some((nav) => nav.id === checkNav);
    if (!checkNav || !currentNavExists) {
      setCheckNav(navs[0].id);
      bus.emit("NAV_CHANGE", navs[0].id);
    }
  }, [checkNav, navs]);

  return (
    <AnimatePresence>
      {getSidebar()?.visible && (
        <>
          <AnimatePresence>
            {contextMenu.visible && contextMenuNav && (
              <motion.div
                ref={contextMenuRef}
                className="fixed z-60 w-35"
                style={{ left: contextMenu.x, top: contextMenu.y }}
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -2 }}
                transition={{ duration: 0.14 }}
              >
                <GlassSurface
                  width="100%"
                  height="auto"
                  borderRadius={16}
                  backgroundOpacity={0.16}
                  saturation={1.5}
                  borderWidth={0}
                  brightness={50}
                  opacity={0.93}
                  blur={8}
                  displace={1.2}
                  distortionScale={-180}
                  redOffset={0}
                  greenOffset={10}
                  blueOffset={20}
                  mixBlendMode="screen"
                  className="w-full"
                  contentClassName="p-0! items-stretch! justify-start!"
                >
                  <div className="space-y-1.5 p-2 w-full">
                    {navContextActions.map((action) => (
                      <Button
                        key={action.key}
                        disabled={action.disabled}
                        block={true}
                        className={clsx(
                          "text-#ffffff/75 bg-#ffffff/15 hover:bg-#ffffff/10 justify-start!",
                          action.danger &&
                            "bg-[#d6455d]! hover:bg-[#c53c53]! active:bg-[#ae3147]!",
                        )}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (action.disabled) {
                            return;
                          }
                          action.onSelect();
                        }}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </GlassSurface>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {editingNav && (
              <motion.div
                ref={editPanelRef}
                className="fixed z-61"
                style={{
                  left: editPanelPosition.x,
                  top: editPanelPosition.y,
                }}
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -2 }}
                transition={{ duration: 0.14 }}
              >
                <GlassSurface
                  width="100%"
                  height="auto"
                  borderRadius={24}
                  backgroundOpacity={0.16}
                  saturation={1.5}
                  borderWidth={0}
                  brightness={50}
                  opacity={0.93}
                  blur={8}
                  displace={1.2}
                  distortionScale={-180}
                  redOffset={0}
                  greenOffset={10}
                  blueOffset={20}
                  mixBlendMode="screen"
                  className="w-full"
                  contentClassName="p-0! items-stretch! justify-start!"
                >
                  <div className="p-3">
                    <NavForm
                      value={{
                        name: editingNav.name,
                        icon: editingNav.icon,
                      }}
                      submitText="保存"
                      onSubmit={handleSaveNavEdit}
                      onCancel={() => setEditingNav(null)}
                    />
                  </div>
                </GlassSurface>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {pendingDeleteNav && (
              <motion.div
                ref={deletePanelRef}
                className="fixed z-61 w-[min(244px,calc(100vw-32px))]"
                style={{
                  left: deletePanelPosition.x,
                  top: deletePanelPosition.y,
                }}
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -2 }}
                transition={{ duration: 0.14 }}
              >
                <GlassSurface
                  width="100%"
                  height="auto"
                  borderRadius={16}
                  backgroundOpacity={0.16}
                  saturation={1.5}
                  borderWidth={0}
                  brightness={50}
                  opacity={0.93}
                  blur={8}
                  displace={1.2}
                  distortionScale={-180}
                  redOffset={0}
                  greenOffset={10}
                  blueOffset={20}
                  mixBlendMode="screen"
                  className="w-full"
                  contentClassName="p-0! items-stretch! justify-start!"
                >
                  <div className="space-y-3 p-3">
                    <div>
                      <div className="text-[16px] text-#ffffff/75">
                        删除分类
                      </div>
                      <div className="mt-1 text-[12px] leading-[1.6] text-#ffffff/60">
                        确定删除分类「{pendingDeleteNav.name}
                        」吗？删除后不会自动恢复。
                      </div>
                    </div>

                    <div className="space-x-3 flex items-center">
                      <button
                        className="px-2.5 text-3.5 text-[var(--c-text-color)] w-full h-7.5 leading-normal bg-[var(--c-bg-color-50)] border-none rounded-full cursor-pointer active:scale-95 transition-transform duration-250"
                        onClick={() => setPendingDeleteNav(null)}
                      >
                        取消
                      </button>
                      <button
                        className="px-2.5 text-3.5 text-#dfdfd7 w-full h-7.5 leading-normal bg-#d6455d border-none rounded-full cursor-pointer active:scale-95 transition-transform duration-250 hover:bg-#c53c53"
                        onClick={handleConfirmDeleteNav}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </GlassSurface>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className={clsx(
              "absolute top-3 bottom-3 w-12.5 pointer-events-none z-10",
              {
                "left-3": placement === "left",
                "right-3": placement === "right",
              },
            )}
            initial={{ x: placement === "left" ? -10 : 10 }}
            animate={{ x: 0 }}
            exit={{ x: placement === "left" ? -10 : 10 }}
            transition={{ duration: 0.25 }}
          >
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={50}
              backgroundOpacity={0.2}
              saturation={1.5}
              borderWidth={0}
              brightness={50}
              opacity={0.93}
              blur={8}
              displace={1.2}
              distortionScale={-180}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              mixBlendMode="screen"
              className="w-full h-full pointer-events-auto"
              contentClassName="p-0! items-stretch! justify-start!"
            >
              <div className="w-full h-full flex flex-col flex-wrap">
                {/*Logo*/}
                <div className="space-y-1.5 py-3 text-#ffffff/60 hover:text-#ffffff w-full flex flex-col items-center justify-center cursor-pointer transition-colors duration-250">
                  <Image
                    className="shrink-0 w-7.5 h-7.5 bg-#f5f5f5 pointer-events-none"
                    rounded={true}
                  />
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
                                  {(provided, snapshot) => {
                                    const draggableItem = (
                                      <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        style={{
                                          ...provided.draggableProps.style,
                                          // 锁定横向位移，避免拖拽项在窄侧边栏里左右晃动
                                          transform:
                                            snapshot.isDragging &&
                                            provided.draggableProps.style
                                              ?.transform
                                              ? provided.draggableProps.style.transform.replace(
                                                  /translate3d\(([^,]+),/,
                                                  "translate3d(0,",
                                                )
                                              : provided.draggableProps.style
                                                  ?.transform,
                                        }}
                                        className={clsx(
                                          "w-12.5! overflow-hidden text-#ffffff/60",
                                          snapshot.isDragging && "opacity-80",
                                        )}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleNavClick(nav.id);
                                        }}
                                        onContextMenu={(e) => {
                                          openNavContextMenu(e, nav);
                                        }}
                                      >
                                        <div
                                          {...provided.dragHandleProps}
                                          className={clsx(
                                            "parent shrink-0 space-y-0.5 w-full h-12.5 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-250 border-2 border-transparent",
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
                                    );

                                    if (
                                      snapshot.isDragging &&
                                      typeof document !== "undefined"
                                    ) {
                                      return createPortal(
                                        draggableItem,
                                        document.body,
                                      );
                                    }

                                    return draggableItem;
                                  }}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>

                      {/*新增 Nav 分组 - 放在滚动条外面*/}
                      <SettingNav
                        trigger="click"
                        placement="right"
                        onOk={addNav}
                      >
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
                  <div className="i-mingcute:settings-3-line w-5.5 h-5.5 text-#ffffff/60 tranistion-transform duration-500 parent-hover:rotate-180"></div>
                </div>
              </div>
            </GlassSurface>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
