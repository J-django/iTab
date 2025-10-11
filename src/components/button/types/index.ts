import type { ReactNode, MouseEvent } from "react";

export type ButtonProps = {
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  rounded?: boolean;
  className?: string;
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};
