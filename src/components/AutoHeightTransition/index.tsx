import { useEffect, useRef, useState, useMemo } from "react";

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

  const updateHeight = () => {
    if (innerRef.current) {
      if (enableBlur) {
        setAnimating(true);
        setTimeout(() => {
          setAnimating(false);
        }, transitionDelay);
      }
      setHeight(`${innerRef.current.clientHeight}px`);
    }
  };

  useEffect(() => {
    if (!innerRef.current) return;
    const ro = new ResizeObserver(() => {
      updateHeight();
    });
    ro.observe(innerRef.current);

    return () => {
      ro.disconnect();
    };
  }, []);

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
