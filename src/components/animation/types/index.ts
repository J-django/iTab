import type { ReactNode } from "react";
import type { Variants } from "framer-motion";

export type AnimationProps = {
  visible?: boolean;
  children?: ReactNode;
  variants?: Variants;
  duration?: number;
  animateHeight?: boolean;
  animateOnMount?: boolean;
};
