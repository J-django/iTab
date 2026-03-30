import type { Variants } from "framer-motion";

export const DEFAULT_OFFSET = 12;

export const popVariants: Variants = {
  initial: {
    y: -10,
    scale: 0.95,
  },
  animate: {
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export const panelContentVariants: Variants = {
  initial: { opacity: 0, y: -4 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.18,
      delay: 0.04,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -2,
    transition: {
      duration: 0.12,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export const listVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.02,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 6 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
