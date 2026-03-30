import Modal from "@/components/modal";
import { Button } from "@/components/button";
import { clsx } from "clsx";

import type { ConfirmDialogProps } from "../types";

export const ConfirmDialog = ({
  visible,
  title,
  description,
  confirmText = "确认",
  cancelText = "取消",
  danger = false,
  centered = true,
  className,
  contentClassName,
  bodyClassName,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <Modal
      visible={visible}
      centered={centered}
      closeIcon={false}
      fullScreenIcon={false}
      maskClosable={false}
      className={className}
      contentClassName={contentClassName || "w-[min(420px,calc(100vw-32px))]!"}
      onClose={onCancel}
    >
      <div className={clsx("space-y-5", bodyClassName)}>
        <div>
          <div className="text-[18px] font-medium text-[var(--c-text-color)]">
            {title}
          </div>
          {description && (
            <div className="mt-2 text-[13px] leading-[1.6] text-[var(--c-text-color-45)]">
              {description}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button className="min-w-18" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            className={
              danger
                ? "min-w-18 bg-[#e65066]! text-white hover:bg-[#d84359]! active:bg-[#bf3348]!"
                : "min-w-18"
            }
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
