import { useState, useEffect, isValidElement } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { backdropVariants, modalVariants } from "../constant";
import { isNull, isFunction } from "lodash-es";
import { clsx } from "clsx";

import type { ReactNode } from "react";
import type { ModalProps } from "../types";

export const Modal = (props: ModalProps) => {
  const {
    ref,
    visible,
    centered,
    closeIcon = true,
    mask = true,
    maskClosable = true,
    keyboard = true,
    fullScreenIcon = true,
    getContainer,
  } = props;
  const { children, className, contentClassName } = props;
  const { onOpen, onClose, onAfterClose } = props;

  // State
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (visible) {
      onOpen?.();
    } else {
      onClose?.();
    }
    setIsFullScreen(false);
  }, [visible]);

  useEffect(() => {
    if (!visible || !keyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, keyboard, onClose]);

  const ModalContent = (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        if (!visible) {
          onAfterClose?.();
        }
      }}
    >
      {visible && (
        <motion.div
          ref={ref}
          className={clsx(
            "fixed inset-0 flex justify-center z-99 pointer-events-none",
            centered ? "items-center" : "items-start",
            className,
          )}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* 遮罩层 */}
          {mask && (
            <motion.div
              className="absolute inset-0 bg-black/35 z-0 pointer-events-auto"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => {
                if (maskClosable) {
                  onClose?.();
                }
              }}
            />
          )}

          {/* 内容 */}
          <motion.div
            className={clsx(
              "relative p-3 bg-[var(--c-bg-color)] shadow-lg pointer-events-auto transition-[background-color]",
              contentClassName,
              [
                isFullScreen
                  ? "m-0 w-full h-full rounded-none"
                  : "m-5 w-200 rounded-3",
              ],
            )}
            layout={true}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {/*关闭按钮*/}
            <ModalOperate>
              {/*全屏*/}
              {fullScreenIcon && (
                <span
                  className="inline-flex pointer-events-auto"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                >
                  {typeof fullScreenIcon === "function" ? (
                    fullScreenIcon(isFullScreen)
                  ) : (
                    <FullScreen fullscreen={isFullScreen} />
                  )}
                </span>
              )}

              {/*关闭*/}
              <span
                className="inline-flex pointer-events-auto"
                onClick={() => onClose?.()}
              >
                {isValidElement(closeIcon)
                  ? closeIcon
                  : closeIcon && <CloseIcon />}
              </span>
            </ModalOperate>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (isNull(getContainer)) {
    return getContainer;
  }

  const container = isFunction(getContainer)
    ? getContainer()
    : getContainer || document.body;

  return createPortal(ModalContent, container);
};

const ModalOperate = ({ children }: { children: ReactNode }) => {
  return (
    <div className="space-x-2 absolute top-2 right-2 flex items-center justify-center pointer-events-none">
      {children}
    </div>
  );
};

// 关闭图标
const CloseIcon = () => {
  return (
    <div className="parent w-5.5 h-5.5 bg-[var(--c-text-color-5)] hover:bg-[var(--c-text-color-10)] active:bg-[var(--c-text-color-15)] flex items-center justify-center rounded-1.5 cursor-pointer transition-colors duration-250 select-none">
      <div
        className="i-pajamas:close w-4.5 h-4.5 text-[var(--c-text-color-50)]"
        title="exit"
      ></div>
    </div>
  );
};

// 全屏/取消全屏按钮
const FullScreen = ({ fullscreen }: { fullscreen: boolean }) => {
  return (
    <div className="parent w-5.5 h-5.5 bg-[var(--c-text-color-5)] hover:bg-[var(--c-text-color-10)] active:bg-[var(--c-text-color-15)] flex items-center justify-center rounded-1.5 cursor-pointer transition-colors duration-250 select-none">
      {!fullscreen ? (
        <div
          className="i-cuida:maximize-outline w-4.5 h-4.5 text-[var(--c-text-color-50)]"
          title="maximize"
        ></div>
      ) : (
        <div
          className="i-cuida:shrink-outline w-4.5 h-4.5 text-[var(--c-text-color-50)]"
          title="minimize"
        ></div>
      )}
    </div>
  );
};
