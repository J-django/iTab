import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import type { App } from "@/types";

// ─── App Logo ────────────────────────────────────────────────────────────────

const AppLogo = ({ app }: { app: App }) => {
  const isIconClass = app.logo?.startsWith("i-");
  const isUrl = app.logo?.startsWith("http") || app.logo?.startsWith("//");

  return (
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg"
      style={{ background: app.background || "#667eea" }}
    >
      {isIconClass && (
        <div className={`${app.logo} w-8 h-8 text-white pointer-events-none`} />
      )}
      {isUrl && (
        <img
          src={app.logo}
          alt={app.name}
          className="w-8 h-8 object-contain pointer-events-none"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      {!isIconClass && !isUrl && (
        <span className="text-white text-xl font-bold pointer-events-none select-none">
          {app.name?.charAt(0)?.toUpperCase()}
        </span>
      )}
    </div>
  );
};

// ─── Folder Logo ─────────────────────────────────────────────────────────────

export const FolderLogo = ({ app, isOver }: { app: App; isOver?: boolean }) => {
  const children = app.children?.slice(0, 4) || [];

  return (
    <motion.div
      className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg border border-white/20"
      style={{ background: "rgba(255,255,255,0.18)" }}
      animate={
        isOver
          ? {
              scale: 1.18,
              boxShadow:
                "0 0 0 3px rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.3)",
            }
          : {
              scale: 1,
              boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
            }
      }
      transition={{ type: "spring", damping: 15, stiffness: 300 }}
    >
      {children.length > 0 ? (
        <div className="grid grid-cols-2 gap-0.75 p-1.5">
          {children.map((child) => (
            <div
              key={child.id}
              className="w-4.5 h-4.5 rounded flex items-center justify-center overflow-hidden"
              style={{ background: child.background || "#667eea" }}
            >
              {child.logo?.startsWith("i-") && (
                <div
                  className={`${child.logo} text-white pointer-events-none`}
                  style={{ width: 10, height: 10, fontSize: 10 }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="i-material-symbols:folder-outline w-7 h-7 text-white/70" />
      )}
    </motion.div>
  );
};

// ─── Sortable App Item ────────────────────────────────────────────────────────

interface AppItemProps {
  app: App;
  isOverFolder?: boolean;
  onFolderClick?: (app: App) => void;
  isDragOverlay?: boolean;
}

export const AppItem = ({
  app,
  isOverFolder,
  onFolderClick,
  isDragOverlay,
}: AppItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: app.id,
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (app.type === "folder") {
      e.preventDefault();
      e.stopPropagation();
      onFolderClick?.(app);
    } else if (app.url) {
      window.open(app.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? 0 : undefined,
      }}
      {...attributes}
      {...listeners}
      className="touch-manipulation outline-none"
    >
      <motion.div
        className="flex flex-col items-center gap-1.5 cursor-pointer select-none w-18"
        whileHover={{ scale: isDragOverlay ? 1 : 1.08 }}
        whileTap={{ scale: isDragOverlay ? 1 : 0.93 }}
        onClick={handleClick}
      >
        {app.type === "folder" ? (
          <FolderLogo app={app} isOver={isOverFolder} />
        ) : (
          <AppLogo app={app} />
        )}
        <span className="text-xs text-white/90 text-center leading-tight w-full truncate drop-shadow-sm px-0.5">
          {app.name}
        </span>
      </motion.div>
    </div>
  );
};

// ─── Drag Overlay Item (no sortable, just visual) ─────────────────────────────

export const DragOverlayItem = ({ app }: { app: App }) => {
  return (
    <motion.div
      className="flex flex-col items-center gap-1.5 select-none w-18"
      initial={{ scale: 1 }}
      animate={{ scale: 1.12, rotate: 2 }}
      transition={{ type: "spring", damping: 15, stiffness: 300 }}
    >
      {app.type === "folder" ? (
        <FolderLogo app={app} />
      ) : (
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl"
          style={{ background: app.background || "#667eea" }}
        >
          {app.logo?.startsWith("i-") && (
            <div
              className={`${app.logo} w-8 h-8 text-white pointer-events-none`}
            />
          )}
          {(app.logo?.startsWith("http") || app.logo?.startsWith("//")) && (
            <img
              src={app.logo}
              alt={app.name}
              className="w-8 h-8 object-contain pointer-events-none"
            />
          )}
          {!app.logo?.startsWith("i-") &&
            !app.logo?.startsWith("http") &&
            !app.logo?.startsWith("//") && (
              <span className="text-white text-xl font-bold pointer-events-none">
                {app.name?.charAt(0)?.toUpperCase()}
              </span>
            )}
        </div>
      )}
      <span className="text-xs text-white/90 text-center leading-tight w-full truncate drop-shadow-sm px-0.5">
        {app.name}
      </span>
    </motion.div>
  );
};
