import { useEffect } from "react";
import type { RefObject } from "react";

export function useClickOutside(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  handler: (event: MouseEvent | TouchEvent) => void,
) {
  useEffect(() => {
    const refList = Array.isArray(refs) ? refs : [refs];

    function listener(event: MouseEvent | TouchEvent) {
      // 如果点击在任意一个 ref 内，就不触发 handler
      const clickedInside = refList.some(
        (ref) => ref.current && ref.current.contains(event.target as Node),
      );
      if (clickedInside) return;

      handler(event);
    }

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, handler]);
}
