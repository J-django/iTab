import { useEffect, useRef } from "react";

export function useKeyCombo(
  keys: string[],
  callback: (event: KeyboardEvent) => void,
) {
  const pressedKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const lowerKeys = keys.map((k) => k.toLowerCase());

    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeys.current.add(event.key.toLowerCase());

      // 判断是否所有组合键都被按下
      const allPressed = lowerKeys.every((k) => pressedKeys.current.has(k));
      if (allPressed) {
        callback(event);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.current.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keys, callback]);
}
