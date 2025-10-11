import type { SearchEngineItem } from "@/types";
import { searchEngineIcons, searchEngineRecord } from "@/constant";

export function getSearchEngineURL(key: SearchEngineItem["key"]) {
  return searchEngineRecord?.find((f) => f?.key === key)?.url;
}

export function getSearchEngineIcon(key: SearchEngineItem["key"]) {
  return searchEngineIcons?.find((f) => f?.key === key)?.url;
}
