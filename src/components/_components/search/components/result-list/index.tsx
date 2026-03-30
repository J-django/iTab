import { AnimatePresence, motion } from "framer-motion";
import { GlassSurface } from "@/components/glass-surface";
import { buildSearchUrl } from "../../utils";
import { popVariants, panelContentVariants } from "../../constant";
import { clsx } from "clsx";

import type { ResultListProps } from "../../types";

// 查询结果产出层
const ResultList = (props: ResultListProps) => {
  const {
    ref,
    visible,
    offset,
    list,
    selectedIndex,
    headerText,
    searchEngineUse,
    searchEngineList,
  } = props;

  function handleLeave(q?: string) {
    const url = buildSearchUrl(searchEngineUse, q, searchEngineList);

    if (!url) {
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          key="dropdown"
          className="absolute left-0 mt-3 w-full z-20 transition-[margin] duration-350"
          onMouseDown={(event) => event.preventDefault()}
          style={{
            marginTop: `${offset}px`,
            transformOrigin: "top center",
            willChange: "transform",
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={popVariants}
        >
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={18}
            backgroundOpacity={0.15}
            saturation={1.5}
            borderWidth={0}
            brightness={50}
            opacity={0.93}
            blur={8}
            displace={1.2}
            distortionScale={-180}
            redOffset={0}
            greenOffset={10}
            blueOffset={20}
            mixBlendMode="screen"
            className="w-full"
            contentClassName="p-0! items-stretch! justify-start!"
          >
            <motion.div
              className="px-1 py-1.75 w-full"
              variants={panelContentVariants}
            >
              {headerText && (
                <div className="px-3 py-1 text-[12px] text-#ffffff/60 tracking-[0.04em]">
                  {headerText}
                </div>
              )}
              <ul className="my-0 px-0.75 py-0 list-none w-full">
                {list?.map((m, index) => (
                  <li
                    key={m.q}
                    className={clsx(
                      "space-x-2 pl-2.5 pr-1.5 py-1 text-3.75 w-full leading-normal flex items-center rounded-full cursor-pointer transition-colors duration-100",
                      [
                        selectedIndex === index
                          ? "text-white bg-#0078f8"
                          : "text-#ffffff/75 hover:bg-[--c-bg-color-25] ",
                      ],
                    )}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleLeave(m?.q);
                    }}
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
            </motion.div>
          </GlassSurface>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultList;
