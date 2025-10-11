import { AnimatePresence, motion } from "framer-motion";
import { Scrollbars } from "react-custom-scrollbars-2";
import Image from "@/components/image";
import { SettingSearchEngine } from "@/components/_components/setting-search-engine";
import { useConfigStore } from "@/store";
import { popVariants, listVariants, itemVariants } from "../../constant";
import { getSearchEngineIcon } from "../../utils";
import { orDefault } from "@/utils";

import type { SearchEngineItem } from "@/types";
import type { EngineProps } from "../../types";

// 搜索引擎弹出层
const SearchEngine = (props: EngineProps) => {
  // Props
  const { ref, containerRef, visible, onChange } = props;

  // Hooks
  const { searchEngine, setEngineUse, removeEngine } = useConfigStore();

  // Func
  function handleToggle(key: SearchEngineItem["key"]) {
    setEngineUse(key);
    onChange();
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          key="dropdown"
          className="absolute left-0 mt-3 px-1 py-1.75 w-full bg-[var(--c-bg-color-35)] backdrop-blur-3 rounded-3 z-15"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={popVariants}
        >
          <Scrollbars
            autoHeight={true}
            autoHeightMax={234}
            renderThumbVertical={({ style, ...props }) => (
              <div
                {...props}
                style={{ ...style }}
                className="bg-[var(--c-text-color-35)] hover:bg-[var(--c-text-color-45)] rounded-full transition-[background-color] duration-250 z-5"
              />
            )}
          >
            <motion.ul
              className="m-0 px-0.75 py-0 list-none w-full flex items-center justify-start flex-wrap"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {searchEngine?.list?.map((m) => (
                <motion.li
                  key={m.key}
                  className="parent relative space-y-0.5 p-1.5 m-1.75 w-16 h-16 shrink-0 hover:bg-[var(--c-bg-color-25)] rounded-2 flex flex-col items-center justify-center cursor-pointer transition-colors duration-250"
                  variants={itemVariants}
                  onClick={() => handleToggle(m?.key)}
                >
                  <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-1.5">
                    <Image
                      className="shrink-0 w-6 h-6 pointer-events-none select-none"
                      loadingRounded={true}
                      src={getSearchEngineIcon(m?.key)}
                    />
                  </div>
                  <span className="text-3 text-[var(--c-text-color-75)] max-w-full leading-tight select-none truncate">
                    {m?.title}
                  </span>

                  {/*删除*/}
                  {orDefault(searchEngine?.list?.length, 0) > 1 && (
                    <div
                      className="parent absolute -top-1.25 -right-1.25 m-0 w-3.75 h-3.75 bg-[var(--c-bg-color-50)] hover:bg-#ee2b47 flex items-center justify-center rounded-full cursor-pointer opacity-0 parent-hover:opacity-100 pointer-events-auto transition-[background-color,opacity] duration-100"
                      onClick={(e) => {
                        removeEngine(m?.key);
                        e.stopPropagation();
                      }}
                    >
                      <div className="i-iconamoon:close-fill w-3.75 h-3.75 text-[var(--c-text-color-75)] parent-hover:text-white transition-colors duration-100"></div>
                    </div>
                  )}
                </motion.li>
              ))}

              {/*新增*/}
              <SettingSearchEngine getContainer={containerRef.current}>
                <motion.li
                  key="add-search-engine"
                  className="parent relative space-y-0.5 p-1.5 my-1.75 w-16 h-16 shrink-0 rounded-md flex flex-col items-center justify-center"
                  variants={itemVariants}
                >
                  <div className="shrink-0 w-9 h-9 bg-[var(--c-bg-color-15)] hover:bg-[var(--c-bg-color-25)] flex items-center justify-center rounded-1.5 cursor-pointer transition-colors duration-250">
                    <div className="i-tabler:plus w-5 h-5 text-[var(--c-text-color-75)]"></div>
                  </div>
                </motion.li>
              </SettingSearchEngine>
            </motion.ul>
          </Scrollbars>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchEngine;
