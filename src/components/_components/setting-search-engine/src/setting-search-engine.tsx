import { useState, useMemo } from "react";
import Modal from "@/components/modal";
import { motion } from "framer-motion";
import { Scrollbars } from "react-custom-scrollbars-2";
import Image from "@/components/image";
import { useConfigStore } from "@/store";
import { searchEngineRecord, searchEngineIcons } from "@/constant";
import { itemVariants, listVariants } from "../../search/constant";
import { orDefault } from "@/utils";
import { isNumber } from "lodash-es";
import { clsx } from "clsx";

import type { EditSearchEngineProps } from "../types";
import type { SearchEngineItem } from "@/types";

export const SettingSearchEngine = (props: EditSearchEngineProps) => {
  // Props
  const { getContainer, children } = props;

  // State
  const [visible, setVisible] = useState(false);
  const [customEngine, setCustomEngine] = useState("");

  // Hooks
  const { searchEngine, addEngine, setEngine, removeEngine } = useConfigStore();

  // Func
  function open() {
    setVisible(true);
  }

  function close() {
    setVisible(false);
  }

  function clear() {
    setCustomEngine("");
  }

  function getSearchEngineIcon(key: SearchEngineItem["key"]) {
    return searchEngineIcons?.find((f) => f?.key === key)?.url;
  }

  const isChecked = useMemo(
    () => (key: SearchEngineItem["key"]) => {
      const index = searchEngine?.list?.findIndex((f) => f?.key === key);
      return isNumber(index) ? index > -1 : false;
    },
    [searchEngine?.list],
  );

  function handleToggle(engine: SearchEngineItem) {
    const count = orDefault(searchEngine?.list?.length, 0);
    const checked = isChecked(engine?.key);
    if (count > 1 || !checked) {
      if (isChecked(engine?.key)) {
        removeEngine(engine?.key);
      } else {
        addEngine(engine);
      }
    }
  }

  function handleSave() {
    if (customEngine) {
      const customEngineObj = {
        key: "custom",
        title: "自定义",
        url: customEngine,
      };
      setEngine(customEngineObj, true);
    } else {
      removeEngine("custom");
    }
    setVisible(false);
  }

  return (
    <>
      <div className="inline-flex items-center justify-center" onClick={open}>
        {children}
      </div>

      {/*弹窗*/}
      <Modal
        visible={visible}
        centered={true}
        getContainer={getContainer}
        contentClassName="px-1.5! py-2! h-135"
        onClose={close}
      >
        <div className="space-y-1.5 w-full h-full flex flex-col flex-nowrap">
          <div className="space-x-1 p-1 text-[var(--c-text-color)] w-full leading-tight flex items-end justify-start">
            <span className="text-3.75">添加搜索引擎</span>
            <span className="text-3 opacity-85">(最少保留一项)</span>
          </div>
          <div className="w-full flex-auto overflow-hidden">
            <Scrollbars
              width="100%"
              height="100%"
              renderThumbVertical={({ style, ...props }) => (
                <div
                  {...props}
                  style={{ ...style }}
                  className="bg-[var(--c-text-color-35)] hover:bg-[var(--c-text-color-45)] rounded-full transition-[background-color] duration-250 z-5"
                />
              )}
            >
              <div className="space-y-2 flex flex-col">
                {/*搜索引擎列表*/}
                <motion.ul
                  className="list-none m-0 px-1 py-0 w-full grid grid-cols-1 sm:grid-cols-2 gap-3"
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                >
                  {searchEngineRecord?.map((m) => (
                    <motion.li
                      key={m?.key}
                      className={clsx(
                        "space-x-3 p-2 w-full flex items-center border border-solid rounded-2 transition-colors duration-200",
                        [
                          // 是否选中
                          isChecked(m?.key)
                            ? "bg-#2365b5/10 border-#2365b5/50"
                            : "bg-[var(--c-card-bg-color)] hover:bg-#2365b5/15 border-transparent",
                          // 是否禁用
                          searchEngine?.list?.length === 1 && isChecked(m?.key)
                            ? "opacity-75! cursor-not-allowed"
                            : "cursor-pointer",
                        ],
                      )}
                      variants={itemVariants}
                      onClick={() => handleToggle(m)}
                    >
                      {/*Logo*/}
                      <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-1.5">
                        <Image
                          className="shrink-0 w-6 h-6 pointer-events-none select-none"
                          loadingRounded={true}
                          src={getSearchEngineIcon(m?.key)}
                        />
                      </div>

                      {/*内容*/}
                      <div className="space-y-1 flex-auto flex flex-col items-start overflow-hidden">
                        <p className="m-0 text-3.5 text-[var(--c-text-color-75)] max-w-full leading-none truncate">
                          {m?.title}
                        </p>
                        <span className="m-0 text-3.25 text-[var(--c-text-color-50)] max-w-full leading-none truncate">
                          {m?.url}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </Scrollbars>
          </div>

          {/*自定义*/}
          <div className="px-1 pt-2">
            <div className="space-x-3 pb-1 w-full flex items-center">
              <div className="relative flex-auto">
                <input
                  className="pl-3 pr-8 py-1px text-3.25 text-[var(--c-text-color-75)] placeholder:text-[var(--c-text-color-50)] w-full h-8.5 leading-normal bg-[var(--c-card-bg-color)] rounded-full border-none outline-none border-[var(--c-text-color-45)] hover:shadow-[0_0_0_1px_var(--c-text-color-75)] focus:shadow-[0_0_0_1px_var(--c-text-color-75)] transition-[box-shadow] duration-350"
                  placeholder="自定义搜索引擎"
                  value={customEngine}
                  onChange={(e) => setCustomEngine(e.target.value)}
                />

                {!!customEngine && (
                  <span className="absolute top-50% right-0.75 -translate-y-50% pointer-events-none">
                    <div
                      className="flex items-center justify-center cursor-pointer pointer-events-auto"
                      onClick={clear}
                    >
                      <div className="i-ic:round-cancel m-1 w-5 h-5 text-[var(--c-text-color-75)]"></div>
                    </div>
                  </span>
                )}
              </div>

              <button
                className="px-3.5 text-3.5 text-white h-7 leading-normal bg-#0078f8 border-none rounded-full cursor-pointer active:scale-95 transition-transform duration-250"
                onClick={handleSave}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
