import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import type { Variants } from "framer-motion";
import type { AnimationProps } from "../types";

export const Animation = (props: AnimationProps) => {
  const { visible, variants, duration = 0.25, animateHeight, children } = props;

  const [isAnimating, setIsAnimating] = useState(false);

  const defaultVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const heightVariants = {
    hidden: { height: 0, opacity: 0, overflow: "hidden" },
    visible: { height: "auto", opacity: 1, overflow: "visible" },
  };

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={animateHeight ? "hidden" : "hidden"}
          animate={animateHeight ? "visible" : "visible"}
          exit="hidden"
          variants={
            variants || (animateHeight ? heightVariants : defaultVariants)
          }
          transition={{ duration }}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <div style={{ overflow: isAnimating ? "hidden" : undefined }}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
