import { useEffect, useRef, useState, useMemo, useCallback } from "react";

import type { ReactNode, CSSProperties } from "react";

type AutoHeightTransitionProps = {
  disabled?: boolean;
  transitionDelay?: number;
  children?: ReactNode;
  className?: string;
  innerClassName?: string;
  enableBlur?: boolean;
};

function AutoHeightTransition({
  disabled = false,
  transitionDelay = 150,
  children,
  className,
  innerClassName,
  enableBlur = false,
}: AutoHeightTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [height, setHeight] = useState<string>("auto");
  const [animating, setAnimating] = useState(false);

  const wrapperStyle = useMemo<CSSProperties>(() => {
    return {
      height,
      transition: !disabled ? `height ${transitionDelay}ms` : undefined,
      willChange: "height",
      overflow: "hidden",
    };
  }, [height, disabled, transitionDelay]);

  const innerStyle: CSSProperties = useMemo(() => {
    if (!enableBlur) return {};
    return {
      transition: `filter ${transitionDelay}ms, opacity ${transitionDelay}ms`,
      filter: animating ? "blur(4px)" : "blur(0px)",
      opacity: animating ? 0.7 : 1,
    };
  }, [animating, transitionDelay, enableBlur]);

  const updateHeight = useCallback(() => {
    if (!innerRef.current) {
      return;
    }

    if (enableBlur) {
      if (blurTimerRef.current) {
        clearTimeout(blurTimerRef.current);
      }

      setAnimating(true);
      blurTimerRef.current = setTimeout(() => {
        setAnimating(false);
      }, transitionDelay);
    }

    setHeight(`${innerRef.current.clientHeight}px`);
  }, [enableBlur, transitionDelay]);

  useEffect(() => {
    if (!innerRef.current) return;

    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(innerRef.current);

    return () => {
      ro.disconnect();
      if (blurTimerRef.current) {
        clearTimeout(blurTimerRef.current);
      }
    };
  }, [updateHeight]);

  return (
    <div ref={wrapperRef} style={wrapperStyle} className={className}>
      <div
        ref={innerRef}
        style={innerStyle}
        className={innerClassName}
        children={children}
      />
    </div>
  );
}

export default AutoHeightTransition;
