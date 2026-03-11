import { useState, useRef, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  pointerWithin,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type CollisionDetectionArgs,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { nanoid } from "nanoid";
import { AppItem, DragOverlayItem } from "./app-item";
import type { App } from "@/types";
import type { AppGridProps } from "../types";

// ─── Folder Modal ─────────────────────────────────────────────────────────────

interface FolderModalProps {
  folder: App;
  onClose: () => void;
  activeId: string | null;
  hoverFolderId: string | null;
  onFolderNameChange: (folderId: string, name: string) => void;
}

const FolderModal = ({
  folder,
  onClose,
  activeId,
  hoverFolderId,
  onFolderNameChange,
}: FolderModalProps) => {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(folder.name);
  const folderItems = folder.children || [];

  const handleNameSubmit = () => {
    setEditingName(false);
    if (nameValue.trim()) {
      onFolderNameChange(folder.id, nameValue.trim());
    } else {
      setNameValue(folder.name);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        className="relative z-1 rounded-3xl p-6 min-w-72 max-w-xs border border-white/20 shadow-2xl"
        style={{
          background: "rgba(40, 40, 50, 0.75)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
        }}
        initial={{ scale: 0.75, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.75, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 22, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Folder Name */}
        <div className="flex items-center justify-center mb-5">
          {editingName ? (
            <input
              autoFocus
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSubmit();
                if (e.key === "Escape") {
                  setEditingName(false);
                  setNameValue(folder.name);
                }
              }}
              className="bg-white/10 border border-white/30 rounded-lg px-3 py-1 text-white text-sm text-center outline-none focus:border-white/60 transition-colors w-40"
            />
          ) : (
            <h3
              className="text-white text-sm font-medium cursor-pointer hover:text-white/80 transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
              onClick={() => setEditingName(true)}
              title="点击编辑文件夹名称"
            >
              {folder.name}
            </h3>
          )}
        </div>

        {/* Apps Grid */}
        {folderItems.length > 0 ? (
          <SortableContext
            items={folderItems.map((i) => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-4 gap-4 justify-items-center">
              {folderItems.map((item) => (
                <AppItem
                  key={item.id}
                  app={item}
                  isOverFolder={hoverFolderId === item.id}
                  onFolderClick={() => {}}
                />
              ))}
            </div>
          </SortableContext>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-white/40">
            <div className="i-material-symbols:folder-open-outline w-12 h-12 mb-2" />
            <span className="text-xs">文件夹是空的</span>
          </div>
        )}

        {/* Drag hint */}
        {activeId && (
          <motion.div
            className="mt-4 text-center text-white/40 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            拖到文件夹外可移出
          </motion.div>
        )}

        {/* Close button */}
        <button
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer border-none outline-none"
          onClick={onClose}
        >
          <div className="i-material-symbols:close-rounded w-3.5 h-3.5 text-white/60" />
        </button>
      </motion.div>
    </motion.div>
  );
};

// ─── App Grid ─────────────────────────────────────────────────────────────────

/**
 * 当文件夹只剩 ≤1 个子项时，将其解散，返回处理后的列表。
 * 返回 [新列表, 被解散的文件夹ID数组]
 */
function dissolveSingleItemFolders(itemList: App[]): [App[], string[]] {
  const dissolved: string[] = [];
  const result: App[] = [];
  for (const item of itemList) {
    if (item.type === "folder" && (item.children?.length ?? 0) <= 1) {
      dissolved.push(item.id);
      if (item.children?.length === 1) {
        result.push(item.children[0]);
      }
      // 0 children → 直接丢弃
    } else {
      result.push(item);
    }
  }
  return [result, dissolved];
}

export const AppGrid = ({ apps: initialApps, onChange }: AppGridProps) => {
  const [items, setItems] = useState<App[]>(initialApps);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoverFolderId, setHoverFolderId] = useState<string | null>(null);
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const activeSource = useRef<"grid" | "folder" | null>(null);
  // Ref 用于在 collisionDetection（稳定引用）中访问最新 items
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const openFolder = items.find((i) => i.id === openFolderId) || null;

  // ── Helpers ──────────────────────────────────────────────────────────────

  const updateItems = useCallback(
    (newItems: App[]) => {
      setItems(newItems);
      onChange?.(newItems);
    },
    [onChange],
  );

  const findItem = (
    id: string,
  ): { item: App; source: "grid" | "folder" } | null => {
    const gridItem = items.find((i) => i.id === id);
    if (gridItem) return { item: gridItem, source: "grid" };

    if (openFolderId) {
      const folder = items.find((i) => i.id === openFolderId);
      const folderItem = folder?.children?.find((i) => i.id === id);
      if (folderItem) return { item: folderItem, source: "folder" };
    }
    return null;
  };

  const getActiveItem = () => {
    if (!activeId) return null;
    return findItem(activeId)?.item || null;
  };

  /**
   * 自定义碰撞检测：
   * - 从主网格拖拽时，只有指针真正在文件夹范围内才视为命中文件夹（pointerWithin）
   * - 其他情况使用 closestCenter 进行排序
   */
  const collisionDetection = useCallback((args: CollisionDetectionArgs) => {
    if (activeSource.current === "grid") {
      const pointerCollisions = pointerWithin(args);
      const folderHit = pointerCollisions.find(({ id }) => {
        const item = itemsRef.current.find((i) => i.id === (id as string));
        return item?.type === "folder";
      });
      if (folderHit) return [folderHit];
    }
    return closestCenter(args);
  }, []);

  // ── DnD Handlers ──────────────────────────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveId(id);

    if (items.some((i) => i.id === id)) {
      activeSource.current = "grid";
    } else {
      activeSource.current = "folder";
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over || activeSource.current !== "grid") {
      setHoverFolderId(null);
      return;
    }

    const overItem = items.find((i) => i.id === (over.id as string));
    if (overItem?.type === "folder" && activeId !== over.id) {
      setHoverFolderId(over.id as string);
    } else {
      setHoverFolderId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    const prevActiveId = activeId;
    const prevActiveSource = activeSource.current;

    setActiveId(null);
    setHoverFolderId(null);
    activeSource.current = null;

    if (!over || !prevActiveId) return;

    const activeItemId = prevActiveId;
    const overItemId = over.id as string;

    if (activeItemId === overItemId) return;

    // ── Drag from main grid ──────────────────────────────────────────────
    if (prevActiveSource === "grid") {
      const overItem = items.find((i) => i.id === overItemId);
      const activeItem = items.find((i) => i.id === activeItemId);

      if (!activeItem) return;

      if (overItem?.type === "folder") {
        // 拖到文件夹上 → 进入文件夹（文件夹不能进文件夹）
        if (activeItem.type === "folder") {
          // 文件夹不能放进文件夹，改为普通排序
          const oldIndex = items.findIndex((i) => i.id === activeItemId);
          const newIndex = items.findIndex((i) => i.id === overItemId);
          if (oldIndex !== -1 && newIndex !== -1) {
            updateItems(arrayMove(items, oldIndex, newIndex));
          }
          return;
        }
        const newItems = items
          .filter((i) => i.id !== activeItemId)
          .map((i) =>
            i.id === overItemId
              ? { ...i, children: [...(i.children || []), activeItem] }
              : i,
          );
        updateItems(newItems);
        setOpenFolderId(overItemId);
      } else if (overItem) {
        // 拖到普通 app 上 → 创建文件夹（两者均不能是文件夹）
        if (activeItem.type === "folder" || overItem.type === "folder") {
          // 其中一个是文件夹，仅排序
          const oldIndex = items.findIndex((i) => i.id === activeItemId);
          const newIndex = items.findIndex((i) => i.id === overItemId);
          if (oldIndex !== -1 && newIndex !== -1) {
            updateItems(arrayMove(items, oldIndex, newIndex));
          }
          return;
        }
        const folderId = nanoid();
        const newFolder: App = {
          id: folderId,
          name: "新文件夹",
          logo: "",
          url: "",
          background: "",
          type: "folder",
          children: [overItem, activeItem],
        };
        const newItems = items
          .map((i) => (i.id === overItemId ? newFolder : i))
          .filter((i) => i.id !== activeItemId);
        updateItems(newItems);
        setOpenFolderId(folderId);
      } else {
        // 空白区域 / 普通排序
        const oldIndex = items.findIndex((i) => i.id === activeItemId);
        const newIndex = items.findIndex((i) => i.id === overItemId);
        if (oldIndex !== -1 && newIndex !== -1) {
          updateItems(arrayMove(items, oldIndex, newIndex));
        }
      }
    }

    // ── Drag from folder modal ───────────────────────────────────────────
    if (prevActiveSource === "folder" && openFolderId) {
      const folder = items.find((i) => i.id === openFolderId);
      if (!folder) return;

      const folderChildren = folder.children || [];
      const activeItem = folderChildren.find((i) => i.id === activeItemId);
      if (!activeItem) return;

      const isTargetInGrid = items.some((i) => i.id === overItemId);
      const isTargetInFolder = folderChildren.some((i) => i.id === overItemId);

      if (isTargetInGrid && overItemId !== openFolderId) {
        // 从文件夹弹出到主网格
        const newFolderChildren = folderChildren.filter(
          (i) => i.id !== activeItemId,
        );
        let newItems = items.map((i) =>
          i.id === openFolderId ? { ...i, children: newFolderChildren } : i,
        );

        const insertIndex = newItems.findIndex((i) => i.id === overItemId);
        if (insertIndex !== -1) {
          newItems = [
            ...newItems.slice(0, insertIndex),
            activeItem,
            ...newItems.slice(insertIndex),
          ];
        } else {
          newItems = [...newItems, activeItem];
        }

        // 检查文件夹是否需要解散
        const [dissolved, dissolvedIds] = dissolveSingleItemFolders(newItems);
        updateItems(dissolved);
        if (dissolvedIds.includes(openFolderId)) {
          setOpenFolderId(null);
        }
      } else if (isTargetInFolder) {
        // 文件夹内排序
        const oldIndex = folderChildren.findIndex((i) => i.id === activeItemId);
        const newIndex = folderChildren.findIndex((i) => i.id === overItemId);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newFolderChildren = arrayMove(
            folderChildren,
            oldIndex,
            newIndex,
          );
          const newItems = items.map((i) =>
            i.id === openFolderId ? { ...i, children: newFolderChildren } : i,
          );
          updateItems(newItems);
        }
      }
    }
  };

  const handleFolderNameChange = (folderId: string, name: string) => {
    const newItems = items.map((i) => (i.id === folderId ? { ...i, name } : i));
    updateItems(newItems);
  };

  const activeItem = getActiveItem();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Main Grid */}
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={rectSortingStrategy}
      >
        <div
          className="grid gap-4 pt-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(72px, 72px))",
          }}
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", damping: 20, stiffness: 260 }}
              >
                <AppItem
                  app={item}
                  isOverFolder={hoverFolderId === item.id}
                  onFolderClick={(folder) => setOpenFolderId(folder.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>

      {/* Drag Overlay */}
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeItem ? <DragOverlayItem app={activeItem} /> : null}
      </DragOverlay>

      {/* Folder Modal — rendered inside DndContext so Droppables work cross-modal */}
      <AnimatePresence>
        {openFolderId && openFolder && (
          <FolderModal
            folder={openFolder}
            onClose={() => setOpenFolderId(null)}
            activeId={activeId}
            hoverFolderId={hoverFolderId}
            onFolderNameChange={handleFolderNameChange}
          />
        )}
      </AnimatePresence>
    </DndContext>
  );
};
