import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";

import type { ButtonProps } from "../types";

export const Button = (props: ButtonProps) => {
  // Props
  const { block, rounded, disabled, loading, className, children, onClick } =
    props;

  return (
    <button
      className={clsx(
        "px-2 py-0.75 text-[var(--c-text-color)] bg-[var(--c-text-color-10)] border-none outline-none shrink-0 inline-flex items-center justify-center transition-colors duration-150",
        [
          rounded ? "rounded-full" : "rounded-1.25",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[var(--c-text-color-15)] active:bg-[var(--c-text-color-20)] cursor-pointer",
          { "w-full": block },
          className,
        ],
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ width: 18, height: 18, opacity: 1 }}
            exit={{ width: 0, height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="-ml-0.5 mr-1 flex items-center justify-center overflow-hidden"
          >
            <div className="i-eos-icons:loading w-full h-full"></div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </button>
  );
};
