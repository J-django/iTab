import type { Variants } from "framer-motion";

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const modalVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scaleY: 0.9,
    transformOrigin: "top center",
  },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.25 },
  },
  exit: {
    opacity: 0,
    y: -10,
    scaleY: 0.9,
    transition: { duration: 0.25 },
  },
};
