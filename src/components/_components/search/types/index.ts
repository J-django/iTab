import type { RefObject } from "react";

type GlobalType = {
  visible?: boolean;
};

export type SearchResult = {
  q?: string;
  sa?: string;
  type?: string;
};

export type EngineProps = GlobalType & {
  ref: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  onChange: () => void;
};

export type ResultListProps = GlobalType & {
  ref: RefObject<HTMLDivElement | null>;
  engineVisible?: boolean;
  offset?: number;
  list?: SearchResult[];
  selectedIndex?: number;
};
