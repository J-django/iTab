import { lazy } from "react";

export function lazyWithDelay<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  delay: number = 1000, // 默认延迟 1s
) {
  return lazy(() =>
    Promise.all([
      factory(),
      new Promise((resolve) => setTimeout(resolve, delay)),
    ]).then(([module]) => module),
  );
}
