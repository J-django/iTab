import type { RefObject } from "react";
import type { SearchEngineItem } from "@/types";

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
  headerText?: string;
  searchEngineUse?: SearchEngineItem["key"];
  searchEngineList?: SearchEngineItem[];
};
