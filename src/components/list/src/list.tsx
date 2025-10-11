import { ListItem } from "./list-item";
import { clsx } from "clsx";

import type { FC } from "react";
import type { ListProps } from "../types";
type ListComponent = FC<ListProps> & { Item: typeof ListItem };

export const List = (({ children, className }: ListProps) => {
  return (
    <div
      className={clsx(
        "divide-x-none divide-y divide-solid divide-[var(--c-border-color)]",
        className,
      )}
    >
      {children}
    </div>
  );
}) as ListComponent;

List.Item = ListItem;
