import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { clsx } from "clsx";

import type { MouseEvent } from "react";
import type { App } from "@/types";

const LARGE_ICON_SIZE = 72;
const SMALL_ICON_SIZE = 20;

function isRemoteLogo(logo?: string) {
  return logo?.startsWith("http") || logo?.startsWith("//");
}

function IconGlyph({ app, compact = false }: { app: App; compact?: boolean }) {
  const iconClass = compact ? "w-3.5 h-3.5" : "w-9 h-9";
  const textClass = compact ? "text-[10px]" : "text-[22px]";

  if (app.logo?.startsWith("i-")) {
    return <div className={clsx(app.logo, iconClass, "text-white")} />;
  }

  if (isRemoteLogo(app.logo)) {
    return (
      <img
        src={app.logo}
        alt={app.name}
        className={clsx(
          compact ? "w-3.5 h-3.5" : "w-9 h-9",
          "object-contain pointer-events-none",
        )}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    );
  }

  return (
    <span
      className={clsx(
        textClass,
        "font-semibold text-white pointer-events-none select-none",
      )}
    >
      {app.name?.charAt(0)?.toUpperCase()}
    </span>
  );
}

function AppLogo({ app }: { app: App }) {
  return (
    <div
      className="relative overflow-hidden rounded-[18px] shadow-[0_10px_22px_rgba(0,0,0,0.22)]"
      style={{
        width: LARGE_ICON_SIZE,
        height: LARGE_ICON_SIZE,
        background: app.background || "#5d7df3",
      }}
    >
      <div className="absolute inset-0 rounded-[18px] border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]" />
      <div className="absolute inset-x-3 top-2 h-3 rounded-full bg-white/18 blur-sm" />
      <div className="relative z-1 flex w-full h-full items-center justify-center">
        <IconGlyph app={app} />
      </div>
    </div>
  );
}

export const FolderLogo = ({
  app,
  isMergeTarget,
}: {
  app: App;
  isMergeTarget?: boolean;
}) => {
  const children = app.children?.slice(0, 4) || [];

  return (
    <motion.div
      className="relative overflow-hidden rounded-[18px] border border-white/24 shadow-[0_10px_22px_rgba(0,0,0,0.16)]"
      style={{
        width: LARGE_ICON_SIZE,
        height: LARGE_ICON_SIZE,
        background:
          "linear-gradient(180deg, rgba(208,217,233,0.58) 0%, rgba(168,183,208,0.36) 100%)",
        backdropFilter: "blur(14px) saturate(145%)",
        WebkitBackdropFilter: "blur(14px) saturate(145%)",
      }}
      animate={{
        scale: isMergeTarget ? 1.05 : 1,
        y: isMergeTarget ? -3 : 0,
        boxShadow: isMergeTarget
          ? "0 14px 28px rgba(0,0,0,0.24)"
          : "0 10px 22px rgba(0,0,0,0.16)",
      }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.08)_42%,rgba(255,255,255,0.04)_100%)]" />
      <div className="absolute inset-x-3 top-2 h-3 rounded-full bg-white/24 blur-sm" />

      {children.length > 0 ? (
        <div className="relative z-1 grid grid-cols-2 gap-1.25 p-2.75 pt-4">
          {children.map((child) => (
            <div
              key={child.id}
              className="flex items-center justify-center overflow-hidden rounded-[8px] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
              style={{
                width: SMALL_ICON_SIZE,
                height: SMALL_ICON_SIZE,
                background: child.background || "#5d7df3",
              }}
            >
              <IconGlyph app={child} compact={true} />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative z-1 flex w-full h-full items-center justify-center">
          <div className="i-material-symbols:folder-rounded w-9 h-9 text-white/80" />
        </div>
      )}
    </motion.div>
  );
};

function DesktopItemBody({
  app,
  isMergeTarget,
  isDragOverlay,
  insideFolder,
  onClick,
}: {
  app: App;
  isMergeTarget?: boolean;
  isDragOverlay?: boolean;
  insideFolder?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <motion.div
      className={clsx(
        "flex flex-col items-center justify-start gap-2 select-none",
        insideFolder ? "w-[86px]" : "w-[90px]",
      )}
      whileHover={isDragOverlay ? undefined : { scale: 1.03, y: -2 }}
      whileTap={isDragOverlay ? undefined : { scale: 0.985 }}
      animate={{
        y: isMergeTarget ? -3 : 0,
        scale: isMergeTarget ? 1.03 : 1,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      onClick={onClick}
    >
      {app.type === "folder" ? (
        <FolderLogo app={app} isMergeTarget={isMergeTarget} />
      ) : (
        <AppLogo app={app} />
      )}

      <span
        className={clsx(
          "max-w-full px-1 text-center text-white leading-[1.2] tracking-[0.01em]",
          insideFolder ? "text-[11px]" : "text-[12px]",
        )}
        style={{
          textShadow: "0 1px 3px rgba(0,0,0,0.52)",
        }}
      >
        {app.name}
      </span>
    </motion.div>
  );
}

interface AppItemProps {
  app: App;
  isMergeTarget?: boolean;
  onFolderOpen?: (app: App) => void;
  isDragOverlay?: boolean;
  insideFolder?: boolean;
}

export const AppItem = ({
  app,
  isMergeTarget,
  onFolderOpen,
  isDragOverlay,
  insideFolder,
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

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (app.type === "folder") {
      event.preventDefault();
      event.stopPropagation();
      onFolderOpen?.(app);
      return;
    }

    if (app.url) {
      window.open(app.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? 0 : undefined,
      }}
      className={clsx(
        "touch-manipulation outline-none",
        isDragOverlay ? "cursor-default" : "cursor-grab active:cursor-grabbing",
      )}
      data-id={app.id}
      {...attributes}
      {...listeners}
    >
      <DesktopItemBody
        app={app}
        isMergeTarget={isMergeTarget}
        isDragOverlay={isDragOverlay}
        insideFolder={insideFolder}
        onClick={handleClick}
      />
    </div>
  );
};

export const DragOverlayItem = ({ app }: { app: App }) => {
  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: 1.04, rotate: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      <DesktopItemBody app={app} isDragOverlay={true} />
    </motion.div>
  );
};
