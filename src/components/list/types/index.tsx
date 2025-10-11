import type { ReactNode, JSX } from "react";

export type ListProps = {
  children?: ReactNode;
  className?: string;
};

export type ListItemProps = {
  title?: string;
  describe?: string;
  content?: ReactNode | JSX.Element;
  children?: ReactNode | JSX.Element;
  className?: string;
};
