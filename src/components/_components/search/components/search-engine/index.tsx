import { AnimatePresence, motion } from "framer-motion";
import { Scrollbars } from "react-custom-scrollbars-2";
import { GlassSurface } from "@/components/glass-surface";
import Image from "@/components/image";
import { SettingSearchEngine } from "@/components/_components/setting-search-engine";
import { useConfigStore } from "@/store";
import { popVariants, panelContentVariants } from "../../constant";
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
          className="absolute left-0 mt-3 w-full z-15"
          style={{
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
            contentClassName="p-0! items-stretch! justify-start!"
          >
            <motion.div
              className="px-1.5 py-1 w-full"
              variants={panelContentVariants}
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
                <ul className="m-0 px-0.75 py-0 list-none w-full flex items-center justify-start flex-wrap">
                  {searchEngine?.list?.map((m) => (
                    <li
                      key={m.key}
                      className="parent relative space-y-0.5 p-1.5 m-1.75 w-16 h-16 shrink-0 hover:bg-[var(--c-bg-color-25)] rounded-2 flex flex-col items-center justify-center cursor-pointer transition-colors duration-250"
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
                    </li>
                  ))}

                  {/*新增*/}
                  <SettingSearchEngine getContainer={containerRef.current}>
                    <li className="parent relative space-y-0.5 p-1.5 my-1.75 w-18 h-18 shrink-0 rounded-md flex flex-col items-center justify-center">
                      <div className="shrink-0 w-10 h-10 bg-[var(--c-bg-color-15)] hover:bg-[var(--c-bg-color-25)] flex items-center justify-center rounded-2 cursor-pointer transition-colors duration-250">
                        <div className="i-tabler:plus w-5 h-5 text-[var(--c-text-color-75)]"></div>
                      </div>
                    </li>
                  </SettingSearchEngine>
                </ul>
              </Scrollbars>
            </motion.div>
          </GlassSurface>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchEngine;
