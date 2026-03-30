import { useState, useEffect, Suspense, useCallback } from "react";
import Modal from "@/components/modal";
import Loading from "../components/loading/index";
import { Scrollbars } from "react-custom-scrollbars-2";
import { AnimatePresence, motion } from "framer-motion";
import { settingTabs, settingComponents } from "../constant";
import { bus } from "@/utils";
import { clsx } from "clsx";

import { ComponentEnum } from "../types";

export const SettingConfig = () => {
  // State
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState(settingTabs[0].name);

  // Func
  const resetTab = useCallback(() => {
    setTab(settingTabs[0].name);
  }, []);

  const open = useCallback(() => {
    resetTab();
    setVisible(true);
  }, [resetTab]);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    bus.on("OPEN_SETTING", open);

    return () => bus.off("OPEN_SETTING", open);
  }, [open]);

  useEffect(() => {
    bus.on("CLOSE_SETTING", close);

    return () => bus.off("CLOSE_SETTING", close);
  }, [close]);

  return (
    <Modal
      visible={visible}
      centered={true}
      contentClassName="h-135"
      onClose={close}
    >
      <div className="space-y-1.5 w-full h-full flex flex-col flex-nowrap">
        <div className="leading-normal flex items-center justify-start">
          <span className="text-3.75 text-[var(--c-text-color)] leading-tight transition-[color]">
            设置
          </span>
        </div>
        <div className="w-full flex-auto grid grid-cols-[150px_1fr] gap-3">
          <div className="pt-1 w-full">
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
              <div className="space-y-1.5">
                {settingTabs?.map((m) => (
                  <div
                    key={m.name}
                    className={clsx(
                      "space-x-2 p-2 text-[var(--c-text-color)] w-full h-8.5 leading-8.5 hover:bg-[var(--c-tab-bg-color-50)] flex items-center rounded-1.5 cursor-pointer transition-colors",
                      { "bg-[var(--c-tab-bg-color-50)]": tab === m.name },
                    )}
                    onClick={() => setTab(m.name)}
                  >
                    {m.icon}
                    <span className="text-3.5">{m.title}</span>
                  </div>
                ))}
              </div>
            </Scrollbars>
          </div>
          <div className="p-1 w-full bg-[var(--c-card-bg-color)] rounded-2.5 transition-[background-color]">
            {/*position: absolute; width: 6px; right: 2px; bottom: 2px; top: 2px; border-radius: 3px;*/}
            <Scrollbars
              width="100%"
              height="100%"
              renderTrackHorizontal={({ style, ...props }) => (
                <div
                  {...props}
                  style={{
                    ...style,
                    right: 2,
                    bottom: 0,
                    left: 2,
                    borderRadius: 3,
                  }}
                />
              )}
              renderTrackVertical={({ style, ...props }) => (
                <div
                  {...props}
                  style={{
                    ...style,
                    right: 0,
                    bottom: 2,
                    top: 2,
                    borderRadius: 3,
                  }}
                />
              )}
              renderThumbHorizontal={({ style, ...props }) => (
                <div
                  {...props}
                  style={{ ...style }}
                  className="bg-[var(--c-text-color-35)] hover:bg-[var(--c-text-color-45)] rounded-full transition-[background-color] duration-250 z-5"
                />
              )}
              renderThumbVertical={({ style, ...props }) => (
                <div
                  {...props}
                  style={{ ...style }}
                  className="bg-[var(--c-text-color-35)] hover:bg-[var(--c-text-color-45)] rounded-full transition-[background-color] duration-250 z-5"
                />
              )}
            >
              <AnimatePresence mode="wait">
                {(() => {
                  const Comp = settingComponents[tab as ComponentEnum];

                  return (
                    <motion.div
                      key={tab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="px-2.5">
                        <Suspense fallback={<Loading />}>
                          <Comp />
                        </Suspense>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </Scrollbars>
          </div>
        </div>
      </div>
    </Modal>
  );
};
