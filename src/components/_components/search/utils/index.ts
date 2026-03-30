import type { SearchEngineItem } from "@/types";
import { searchEngineIcons, searchEngineRecord } from "@/constant";

export function getSearchEngine(
  key: SearchEngineItem["key"],
  searchEngineList?: SearchEngineItem[],
) {
  return (
    searchEngineList?.find((item) => item?.key === key) ||
    searchEngineRecord?.find((item) => item?.key === key)
  );
}

export function getSearchEngineURL(
  key: SearchEngineItem["key"],
  searchEngineList?: SearchEngineItem[],
) {
  return getSearchEngine(key, searchEngineList)?.url;
}

export function getSearchEngineIcon(key: SearchEngineItem["key"]) {
  return searchEngineIcons?.find((f) => f?.key === key)?.url;
}

export function buildSearchUrl(
  key: SearchEngineItem["key"],
  query?: string,
  searchEngineList?: SearchEngineItem[],
) {
  const keyword = query?.trim();
  const url = getSearchEngineURL(key, searchEngineList);

  if (!keyword || !url) {
    return "";
  }

  const encodedKeyword = encodeURIComponent(keyword);

  return url.includes("%s")
    ? url.replace(/%s/g, encodedKeyword)
    : `${url}${encodedKeyword}`;
}
