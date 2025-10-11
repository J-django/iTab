import type { RefObject, ReactNode } from "react";

export type DrawerProps = {
  ref?: RefObject<HTMLDivElement | null>;
  visible?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  onAfterClose?: () => void;
  closeIcon?: ReactNode | boolean;
  mask?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  className?: string;
  children?: ReactNode;
  getContainer?: HTMLElement | (() => HTMLElement) | null;
};

export type DrawerAction = {
  open: () => void;
  close: () => void;
};
