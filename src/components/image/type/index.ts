import type { CSSProperties, ReactNode } from "react";

export type ImageProps = {
  src?: string;
  alt?: string;
  className?: string;
  rounded?: boolean;
  loadingRounded?: boolean;
  imageStyle?: CSSProperties;
  children?: (status: { error: boolean; loaded: boolean }) => ReactNode;
  onLoad?: () => void;
  onError?: () => void;
};
