import { AnimatePresence, motion } from "framer-motion";
import { Image } from "@/components/image";
import { useConfigStore } from "@/store";
import { clsx } from "clsx";

import type { Variants } from "framer-motion";

const wallpaperVariants: Variants = {
  initial: { opacity: 0, scale: 1.2 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 1.2,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
};

const Wallpaper = () => {
  const { wallpaper } = useConfigStore();

  return (
    <div className="absolute inset-0 pointer-events-none select-none -z-1">
      <div
        className={clsx(
          "absolute inset-0 w-full h-full z-1 transition-[background-color,backdrop-filter] duration-250",
          {
            "bg-black/35": wallpaper?.overlay,
            "backdrop-blur-10": wallpaper?.blur,
          },
        )}
      ></div>

      <AnimatePresence mode="wait">
        {/* 纯色 */}
        {wallpaper?.type === "color" && (
          <motion.div
            key="color"
            className="w-full h-full pointer-events-none select-none"
            style={{ background: wallpaper?.src }}
            variants={wallpaperVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        )}

        {/* 图像 */}
        {wallpaper?.type === "picture" && (
          <motion.div
            key="picture"
            className="w-full h-full bg-#333333"
            variants={wallpaperVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Image
              className="w-full h-full"
              src={wallpaper?.src}
              imageStyle={{ objectFit: "cover" }}
            />
          </motion.div>
        )}

        {/* 视频 */}
        {wallpaper?.type === "video" && (
          <motion.video
            key="video"
            className="w-full h-full pointer-events-none select-none object-cover"
            src={wallpaper?.src}
            controls={false}
            autoPlay
            muted
            loop
            variants={wallpaperVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallpaper;
