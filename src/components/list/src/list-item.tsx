import { clsx } from "clsx";

import type { ListItemProps } from "../types";

export const ListItem = (props: ListItemProps) => {
  const { title, describe, content, children, className } = props;

  if (children) {
    return (
      <div
        className={clsx(
          "space-x-3 py-2.5 text-3.5 text-[var(--c-text-color)]",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "space-x-3 py-2.5 text-3.5 text-[var(--c-text-color)] flex items-start justify-between transition-colors",
        className,
      )}
    >
      <div className="inline-flex flex-col items-start">
        <span>{title}</span>
        {describe && (
          <p className="m-0 text-3 text-[var(--c-text-color-45)]">{describe}</p>
        )}
      </div>
      {content}
    </div>
  );
};
