import type { RefObject, ReactNode } from "react";

export type ModalProps = {
  ref?: RefObject<HTMLDivElement | null>;
  visible?: boolean;
  closeIcon?: ReactNode | boolean;
  mask?: boolean;
  maskClosable?: boolean;
  centered?: boolean;
  destroyOnClose?: boolean;
  className?: string;
  contentClassName?: string;
  children?: ReactNode;
  keyboard?: boolean;
  fullScreenIcon?: ((fullscreen?: boolean) => ReactNode) | boolean;
  getContainer?: HTMLElement | (() => HTMLElement) | null;
  onClose?: () => void;
  onOpen?: () => void;
  onAfterClose?: () => void;
};
