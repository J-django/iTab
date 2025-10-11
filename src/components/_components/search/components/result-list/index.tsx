import { AnimatePresence, motion } from "framer-motion";
import { useConfigStore } from "@/store";
import { getSearchEngineURL } from "../../utils";
import { popVariants } from "../../constant";
import { clsx } from "clsx";

import type { ResultListProps } from "../../types";

// 查询结果产出层
const ResultList = (props: ResultListProps) => {
  // Props
  const { ref, visible, offset, list, selectedIndex } = props;

  // Hooks
  const { searchEngine } = useConfigStore();

  // Func
  function handleLeave(q?: string) {
    window.open(`${getSearchEngineURL(searchEngine?.use)}${q}`);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          key="dropdown"
          className="absolute left-0 mt-3 w-full bg-[var(--c-bg-color-35)] backdrop-blur-3 rounded-3 z-20 transition-[margin] duration-350"
          style={{ marginTop: `${offset}px` }}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={popVariants}
        >
          <div className="px-1 py-1.75">
            <ul className="my-0 px-0.75 py-0 list-none w-full">
              {list?.map((m, index) => (
                <li
                  key={m.q}
                  className={clsx(
                    "space-x-2 pl-2.5 pr-1.5 py-1 text-3.75 w-full leading-normal flex items-center rounded-1.5 cursor-pointer transition-colors duration-100",
                    [
                      selectedIndex === index
                        ? "text-white bg-#0078f8"
                        : "text-[var(--c-text-color)] hover:bg-[--c-bg-color-25] ",
                    ],
                  )}
                  onClick={() => handleLeave(m?.q)}
                >
                  <span className="flex-auto truncate">{m?.q}</span>
                  <AnimatePresence mode="wait">
                    {selectedIndex === index && (
                      <motion.span
                        key="enter-badge"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.05 }}
                        className="mt-0.15 px-2 py-0.25 text-[var(--c-text-color-85)] text-3.5 leading-tight bg-[var(--c-card-bg-color-75)] rounded-full"
                      >
                        Enter
                      </motion.span>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultList;
