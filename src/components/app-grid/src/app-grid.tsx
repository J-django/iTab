import { useState, useRef, useCallback, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { nanoid } from "nanoid";
import { AppItem, DragOverlayItem } from "./app-item.tsx";

import type { App } from "@/types";
import type { AppGridProps } from "../types";

const DESKTOP_DROPZONE_ID = "__desktop_dropzone__";
const MERGE_HOLD_DELAY = 680;

function clearTimer(
  timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
) {
  if (timerRef.current) {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }
}

function createFolder(target: App, moving: App): App {
  return {
    id: nanoid(),
    name: "新建文件夹",
    logo: "",
    url: "",
    background: target.background || moving.background || "#6c95f5",
    type: "folder",
    children: [target, moving],
  };
}

function ejectItemFromFolder(
  itemList: App[],
  folderId: string,
  itemId: string,
): { items: App[]; shouldCloseFolder: boolean } {
  const folderIndex = itemList.findIndex((item) => item.id === folderId);
  if (folderIndex === -1) {
    return { items: itemList, shouldCloseFolder: false };
  }

  const folder = itemList[folderIndex];
  const folderChildren = folder.children || [];
  const movingItem = folderChildren.find((item) => item.id === itemId);

  if (!movingItem) {
    return { items: itemList, shouldCloseFolder: false };
  }

  const remainingChildren = folderChildren.filter((item) => item.id !== itemId);
  const before = itemList.slice(0, folderIndex);
  const after = itemList.slice(folderIndex + 1);

  if (remainingChildren.length === 0) {
    return {
      items: [...before, movingItem, ...after],
      shouldCloseFolder: true,
    };
  }

  if (remainingChildren.length === 1) {
    return {
      items: [...before, remainingChildren[0], movingItem, ...after],
      shouldCloseFolder: true,
    };
  }

  return {
    items: [
      ...before,
      { ...folder, children: remainingChildren },
      movingItem,
      ...after,
    ],
    shouldCloseFolder: false,
  };
}

function DesktopDropzone({ visible }: { visible: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: DESKTOP_DROPZONE_ID,
  });

  return (
    <motion.div
      ref={setNodeRef}
      className={clsx(
        "mt-5 rounded-3 border border-dashed px-4 py-2.5 text-center transition-all duration-200",
        isOver
          ? "border-white/48 bg-white/14"
          : "border-white/15 bg-black/8 backdrop-blur-sm",
      )}
      animate={{
        opacity: visible ? 1 : 0.72,
        scale: isOver ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      <div className="text-[13px] text-white/92 tracking-[0.02em]">
        拖到这里移回桌面
      </div>
      <div className="mt-1 text-[11px] text-white/55">
        文件夹内可直接拖拽排序
      </div>
    </motion.div>
  );
}

interface FolderPanelProps {
  folder: App;
  activeId: string | null;
  mergeTargetId: string | null;
  onClose: () => void;
  onFolderNameChange: (folderId: string, name: string) => void;
}

function FolderPanel({
  folder,
  activeId,
  mergeTargetId,
  onClose,
  onFolderNameChange,
}: FolderPanelProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(folder.name);
  const folderItems = folder.children || [];

  useEffect(() => {
    setEditingName(false);
    setNameValue(folder.name);
  }, [folder.id, folder.name]);

  const commitFolderName = () => {
    setEditingName(false);

    if (nameValue.trim()) {
      onFolderNameChange(folder.id, nameValue.trim());
      return;
    }

    setNameValue(folder.name);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh] pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.button
        type="button"
        className="absolute inset-0 border-none bg-black/36 backdrop-blur-[8px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative z-1 w-[min(420px,calc(100vw-32px))] rounded-[28px] border border-white/18 px-5 py-4.5 shadow-[0_20px_52px_rgba(0,0,0,0.34)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(132,145,170,0.28) 0%, rgba(74,84,106,0.18) 100%)",
          backdropFilter: "blur(28px) saturate(150%)",
          WebkitBackdropFilter: "blur(28px) saturate(150%)",
        }}
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div className="flex items-center justify-between">
          <div>
            {editingName ? (
              <input
                autoFocus
                value={nameValue}
                onChange={(event) => setNameValue(event.target.value)}
                onBlur={commitFolderName}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    commitFolderName();
                  }

                  if (event.key === "Escape") {
                    setEditingName(false);
                    setNameValue(folder.name);
                  }
                }}
                className="w-40 rounded-full border border-white/28 bg-white/14 px-3 py-1.5 text-[15px] text-white outline-none transition-colors focus:border-white/55"
              />
            ) : (
              <button
                type="button"
                className="rounded-full border-none bg-transparent px-1 py-1 text-left text-[18px] font-medium tracking-[0.02em] text-white"
                onClick={() => setEditingName(true)}
              >
                {folder.name}
              </button>
            )}

            <div className="mt-1 text-[12px] text-white/55">
              像桌面文件夹一样整理常用应用
            </div>
          </div>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full border-none bg-white/10 text-white/72 transition-colors hover:bg-white/18 hover:text-white"
            onClick={onClose}
          >
            <div className="i-material-symbols:close-rounded h-4.5 w-4.5" />
          </button>
        </div>

        <div className="mt-5 rounded-[22px] bg-black/12 px-4 py-4">
          {folderItems.length > 0 ? (
            <SortableContext
              items={folderItems.map((item) => item.id)}
              strategy={rectSortingStrategy}
            >
              <div
                className="grid justify-center gap-x-4 gap-y-5"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(86px, 86px))",
                }}
              >
                {folderItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  >
                    <AppItem
                      app={item}
                      insideFolder={true}
                      isMergeTarget={mergeTargetId === item.id}
                    />
                  </motion.div>
                ))}
              </div>
            </SortableContext>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-white/55">
              <div className="i-material-symbols:folder-open-rounded mb-3 h-10 w-10" />
              <div className="text-[13px]">文件夹里还没有应用</div>
            </div>
          )}
        </div>

        {activeId && <DesktopDropzone visible={true} />}
      </motion.div>
    </motion.div>
  );
}

export const AppGrid = ({ apps: initialApps, onChange }: AppGridProps) => {
  const [items, setItems] = useState<App[]>(initialApps);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mergeTargetId, setMergeTargetId] = useState<string | null>(null);
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);

  const activeSourceRef = useRef<"grid" | "folder" | null>(null);
  const mergeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingMergeTargetRef = useRef<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const openFolder = items.find((item) => item.id === openFolderId) || null;

  const updateItems = useCallback(
    (nextItems: App[]) => {
      setItems(nextItems);
      onChange?.(nextItems);
    },
    [onChange],
  );

  const clearMergeIntent = useCallback(() => {
    clearTimer(mergeTimerRef);
    pendingMergeTargetRef.current = null;
    setMergeTargetId(null);
  }, []);

  const scheduleMergeIntent = useCallback(
    (targetId: string) => {
      if (pendingMergeTargetRef.current === targetId) {
        return;
      }

      clearMergeIntent();
      pendingMergeTargetRef.current = targetId;
      mergeTimerRef.current = setTimeout(() => {
        setMergeTargetId(targetId);
      }, MERGE_HOLD_DELAY);
    },
    [clearMergeIntent],
  );

  useEffect(() => {
    setItems(initialApps);
  }, [initialApps]);

  useEffect(() => {
    return () => clearMergeIntent();
  }, [clearMergeIntent]);

  const getActiveItem = () => {
    if (!activeId) {
      return null;
    }

    const gridItem = items.find((item) => item.id === activeId);
    if (gridItem) {
      return gridItem;
    }

    if (openFolderId) {
      const folder = items.find((item) => item.id === openFolderId);
      return folder?.children?.find((item) => item.id === activeId) || null;
    }

    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const nextActiveId = event.active.id as string;
    setActiveId(nextActiveId);

    activeSourceRef.current = items.some((item) => item.id === nextActiveId)
      ? "grid"
      : "folder";
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (activeSourceRef.current !== "grid") {
      clearMergeIntent();
      return;
    }

    const activeItemId = event.active.id as string;
    const overItemId = event.over?.id as string | undefined;

    if (!overItemId || activeItemId === overItemId) {
      clearMergeIntent();
      return;
    }

    const activeItem = items.find((item) => item.id === activeItemId);
    const overItem = items.find((item) => item.id === overItemId);

    if (!activeItem || !overItem || activeItem.type === "folder") {
      clearMergeIntent();
      return;
    }

    scheduleMergeIntent(overItemId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const previousActiveId = activeId;
    const previousActiveSource = activeSourceRef.current;
    const previousMergeTargetId = mergeTargetId;
    const overItemId = event.over?.id as string | undefined;

    setActiveId(null);
    activeSourceRef.current = null;
    clearMergeIntent();

    if (!previousActiveId || !overItemId) {
      return;
    }

    if (previousActiveSource === "grid") {
      const activeItem = items.find((item) => item.id === previousActiveId);
      const overItem = items.find((item) => item.id === overItemId);

      if (!activeItem || !overItem || activeItem.id === overItem.id) {
        return;
      }

      if (
        previousMergeTargetId === overItemId &&
        activeItem.type !== "folder"
      ) {
        if (overItem.type === "folder") {
          const nextItems = items
            .filter((item) => item.id !== activeItem.id)
            .map((item) =>
              item.id === overItem.id
                ? { ...item, children: [...(item.children || []), activeItem] }
                : item,
            );

          updateItems(nextItems);
          setOpenFolderId(overItem.id);
          return;
        }

        const newFolder = createFolder(overItem, activeItem);
        const nextItems = items
          .map((item) => (item.id === overItem.id ? newFolder : item))
          .filter((item) => item.id !== activeItem.id);

        updateItems(nextItems);
        setOpenFolderId(newFolder.id);
        return;
      }

      const oldIndex = items.findIndex((item) => item.id === activeItem.id);
      const newIndex = items.findIndex((item) => item.id === overItem.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        updateItems(arrayMove(items, oldIndex, newIndex));
      }

      return;
    }

    if (previousActiveSource === "folder" && openFolderId) {
      const folder = items.find((item) => item.id === openFolderId);
      if (!folder) {
        return;
      }

      const folderChildren = folder.children || [];
      const activeItem = folderChildren.find(
        (item) => item.id === previousActiveId,
      );

      if (!activeItem) {
        return;
      }

      if (overItemId === DESKTOP_DROPZONE_ID) {
        const { items: nextItems, shouldCloseFolder } = ejectItemFromFolder(
          items,
          openFolderId,
          activeItem.id,
        );

        updateItems(nextItems);

        if (shouldCloseFolder) {
          setOpenFolderId(null);
        }

        return;
      }

      const oldIndex = folderChildren.findIndex(
        (item) => item.id === activeItem.id,
      );
      const newIndex = folderChildren.findIndex(
        (item) => item.id === overItemId,
      );

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return;
      }

      const nextChildren = arrayMove(folderChildren, oldIndex, newIndex);
      const nextItems = items.map((item) =>
        item.id === openFolderId ? { ...item, children: nextChildren } : item,
      );

      updateItems(nextItems);
    }
  };

  const handleFolderNameChange = (folderId: string, name: string) => {
    updateItems(
      items.map((item) => (item.id === folderId ? { ...item, name } : item)),
    );
  };

  const activeItem = getActiveItem();

  return (
    <div className="relative mt-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div
            className="relative grid justify-start gap-x-7 gap-y-8 pb-16 pt-3"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(90px, 90px))",
            }}
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 8 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                >
                  <AppItem
                    app={item}
                    isMergeTarget={mergeTargetId === item.id}
                    onFolderOpen={(folder) => setOpenFolderId(folder.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>

        <DragOverlay
          dropAnimation={{
            duration: 180,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {activeItem ? <DragOverlayItem app={activeItem} /> : null}
        </DragOverlay>

        <AnimatePresence>
          {openFolder && (
            <FolderPanel
              folder={openFolder}
              activeId={activeId}
              mergeTargetId={mergeTargetId}
              onClose={() => setOpenFolderId(null)}
              onFolderNameChange={handleFolderNameChange}
            />
          )}
        </AnimatePresence>
      </DndContext>
    </div>
  );
};
