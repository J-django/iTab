import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";

import type { DrawerProps, DrawerAction } from "../types";

export const Drawer = forwardRef<DrawerAction, DrawerProps>((props, ref) => {
  const {
    visible,
    mask = true,
    maskClosable = true,
    closeIcon = true,
    className = "",
    children,
    onClose,
    onOpen,
    onAfterClose,
    getContainer = () => document.body,
  } = props;

  const [open, setOpen] = useState(!!visible);

  // 打开抽屉
  const handleOpen = () => {
    setOpen(true);
    onOpen?.();
  };

  // 关闭抽屉
  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  // 点击蒙层
  const handleMaskClick = () => {
    if (maskClosable) {
      handleClose();
    }
  };

  useEffect(() => {
    setOpen(!!visible);
  }, [visible]);

  useImperativeHandle(ref, () => ({ open: handleOpen, close: handleClose }));

  // 抽屉内容
  const drawerContent = (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        if (!visible) {
          onAfterClose?.();
        }
      }}
    >
      {open && (
        <motion.div
          className="fixed inset-0 flex justify-center pointer-events-none"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* 遮罩层 */}
          {mask && (
            <motion.div
              className="fixed inset-0 bg-black/35 z-100 pointer-events-auto"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={handleMaskClick}
            />
          )}

          {/* 抽屉 */}
          <motion.div
            className={clsx(
              "fixed top-0 right-0 p-3 h-full w-full md:w-120 bg-#1e1e20 shadow-lg z-150 pointer-events-auto transition-width duration-250",
              className,
            )}
            variants={{ hidden: { x: "100%" }, visible: { x: 0 } }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
          >
            {/* 关闭按钮 */}
            <div
              className="absolute top-2 right-2 flex items-center justify-center"
              onClick={() => onClose?.()}
            >
              {isValidElement(closeIcon)
                ? closeIcon
                : closeIcon && <CloseIcon />}
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // 挂载容器
  if (getContainer) {
    const container =
      typeof getContainer === "function" ? getContainer() : getContainer;
    return createPortal(drawerContent, container as HTMLElement);
  }

  return drawerContent;
});

// 关闭图标
const CloseIcon = () => {
  return (
    <div className="parent w-6 h-6 bg-white/10 hover:bg-white/15 active:bg-white/6 flex items-center justify-center rounded-1.25 cursor-pointer transition-colors duration-250 select-none">
      <div className="i-majesticons:close-line w-5.5 h-5.5 text-white/35"></div>
    </div>
  );
};
