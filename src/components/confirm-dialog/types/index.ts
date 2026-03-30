export type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  centered?: boolean;
  className?: string;
  contentClassName?: string;
  bodyClassName?: string;
  onConfirm: () => void;
  onCancel: () => void;
};
