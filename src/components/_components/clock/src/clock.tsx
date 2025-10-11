import { useState, useEffect } from "react";
import Animation from "@/components/animation";
import { AnimatePresence, motion } from "framer-motion";
import { useConfigStore } from "@/store";
import { dayjs } from "@/plugin";
import { clsx } from "clsx";

const today = dayjs();
const weekMap = ["日", "一", "二", "三", "四", "五", "六"];

const clockItemConfig = {
  layout: true,
  initial: { opacity: 0, width: 0, height: 0, scale: 0.8 },
  animate: { opacity: 1, width: "auto", height: "auto", scale: 1 },
  exit: { opacity: 0, height: 0, scale: 0 },
  transition: { duration: 0.25 },
};

export const Clock = () => {
  // Hooks
  const clock = useConfigStore((state) => state.clock);

  return (
    <Animation visible={clock?.show} animateHeight={true} animateOnMount={true}>
      <div
        className="space-y-1.5 w-full text-center font-sans"
        style={{ color: clock?.color }}
      >
        {/*时间*/}
        <Time />

        {/*综合*/}
        <div className="space-x-3 flex items-center justify-center">
          <AnimatePresence mode="sync" initial={false}>
            {clock?.date && (
              <motion.div
                key="date"
                {...clockItemConfig}
                className="flex items-center justify-center pointer-events-none select-none transition-color duration-250 overflow-hidden"
              >
                <span className="text-4 text-shadow-md antialiased whitespace-nowrap">
                  {today.format("M月D日")}
                </span>
              </motion.div>
            )}

            {clock?.week && (
              <motion.div
                key="week"
                {...clockItemConfig}
                className="flex items-center justify-center pointer-events-none select-none transition-color duration-250"
              >
                {" "}
                <span className="text-4 text-shadow-md antialiased whitespace-nowrap">
                  星期{weekMap[today.day()]}
                </span>
              </motion.div>
            )}

            {clock?.lunar && (
              <motion.div
                key="lunar"
                {...clockItemConfig}
                className="flex items-center justify-center pointer-events-none select-none transition-color duration-250"
              >
                <span className="text-4 text-shadow-md antialiased whitespace-nowrap">
                  {today.toLunarMonth().getName()}
                  {today.toLunarDay().getName()}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Animation>
  );
};

const Time = () => {
  // State
  const [time, setTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hooks
  const clock = useConfigStore((state) => state.clock);

  function formatTime() {
    if (clock?.hover24) {
      return time.format(formatSecond("HH:mm:ss"));
    } else {
      return time.format(formatSecond("h:mm:ss"));
    }
  }

  function formatSecond(format: string) {
    if (clock?.second) {
      return format;
    } else {
      return format?.replace(":ss", "");
    }
  }

  return (
    // 时间
    <div
      className={clsx(
        "text-shadow-md antialiased leading-none pointer-events-none select-none transition-[font-size,color] duration-250",
        { "font-bold": clock?.bold },
      )}
      style={{ fontSize: `${clock?.size}px` }}
    >
      {formatTime()}
    </div>
  );
};
