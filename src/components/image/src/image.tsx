import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import "../style/index.less";

import type { ImageProps } from "../type";

export const Image = (props: ImageProps) => {
  const {
    src,
    alt,
    className,
    rounded = false,
    loadingRounded = false,
    imageStyle = {},
    children,
    onLoad,
    onError,
  } = props;

  // Ref
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      handleError();
      return;
    }
    setIsImageLoaded(false);
    setHasError(false);

    const img = imageRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      handleLoad();
    }
  }, [src]);

  const handleLoad = () => {
    setIsImageLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsImageLoaded(false);
    setHasError(true);
    onError?.();
  };

  return (
    <div
      className={clsx("relative flex", [
        { "rounded-full overflow-hidden": rounded },
        className,
      ])}
    >
      {/* 图片 */}
      <motion.img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{
          objectFit: "contain",
          ...imageStyle,
          display: src ? "block" : "none", // 没有 src 时隐藏
          visibility: isImageLoaded ? "visible" : "hidden", // 保持布局
        }}
        className="w-full h-full"
        onLoad={handleLoad}
        onError={handleError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isImageLoaded ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />

      {/* 加载中 / 错误状态 */}
      <AnimatePresence>
        {!isImageLoaded &&
          (children ? (
            children({ error: hasError, loaded: isImageLoaded })
          ) : (
            <motion.div
              key={hasError ? "error" : "loading"}
              className={clsx(
                "absolute inset-0 flex items-center justify-center bg-[rgba(255,255,255,0.25)]",
                { "rounded-full overflow-hidden": loadingRounded },
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {hasError ? (
                <div className="i-icon-park-outline:error-picture w-5.5 h-5.5 text-#c1c1c1" />
              ) : (
                <div className="i-line-md:loading-loop w-5.5 h-5.5 text-#c1c1c1" />
              )}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};
