import { useRef, useState, useMemo, useEffect } from "react";
import Animation from "@/components/animation";
import Image from "@/components/image";
import ResultList from "../components/result-list";
import SearchEngine from "../components/search-engine";
import { useConfigStore } from "@/store";
import { useRequest } from "ahooks";
import { search } from "@/api";
import { useClickOutside } from "@/hooks";
import { searchEngineIcons } from "@/constant";
import { DEFAULT_OFFSET } from "../constant";
import { orDefault, getNextIndex, nextTick } from "@/utils";
import { getSearchEngineURL } from "../utils";
import { debounce } from "lodash-es";

import { ChangeEvent, KeyboardEvent } from "react";
import type { SearchResult } from "../types";

export const Search = () => {
  // Ref
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const engineRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  // State
  const [engineVisible, setEngineVisible] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const [resultList, setResultList] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Hooks
  const { searchEngine } = useConfigStore();
  const { run: runSearch } = useRequest(search, {
    manual: true,
    onSuccess(res: any) {
      const list: SearchResult[] = res?.g || [];
      if (list?.length) {
        setResultList(list);
        setSelectedIndex(-1);
        setResultVisible(true);
      } else {
        resetSearch();
      }
      updateRender();
    },
  });

  // Func
  function resetSearch() {
    setResultList([]);
    setSelectedIndex(-1);
    setResultVisible(false);
  }

  function clear() {
    setSearchValue("");
    resetSearch();
  }

  function updateRender() {
    let extraOffset = 1;
    if (engineVisible) {
      extraOffset = 2;
      const height = orDefault(engineRef.current?.clientHeight, 0);
      setOffset(height + DEFAULT_OFFSET * extraOffset || DEFAULT_OFFSET);
    } else {
      setOffset(DEFAULT_OFFSET);
    }
  }

  const onSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (value) {
          runSearch(value);
        } else {
          resetSearch();
        }
      }, 100),
    [engineVisible],
  );

  function handleSearchFocus() {
    if (resultList?.length) {
      setResultVisible(true);
    }
  }

  function handleSearchBlur() {
    setResultVisible(false);
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setSearchValue(value);
    onSearch(value);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    // 回车
    if (event.key === "Enter") {
      if (selectedIndex === -1) {
        window.open(`${getSearchEngineURL(searchEngine?.use)}${searchValue}`);
      } else {
        const param = orDefault(resultList?.[selectedIndex]?.q, searchValue);
        window.open(`${getSearchEngineURL(searchEngine?.use)}${param}`);
      }
    }

    // 向上选择
    if (event.key === "ArrowUp") {
      nextTick(() => {
        const len = inputRef.current?.value?.length || 0;
        inputRef.current?.setSelectionRange(len, len);
      });
      setSelectedIndex((prev) => getNextIndex(prev, "up", resultList.length));
    }

    // 向下选择
    if (event.key === "ArrowDown") {
      setSelectedIndex((prev) => getNextIndex(prev, "down", resultList.length));
    }
  }

  useClickOutside([containerRef, triggerRef, engineRef, resultRef], () => {
    setEngineVisible(false);
    setResultVisible(false);
  });

  useEffect(updateRender, [engineVisible]);

  const searchEngineLogo = useMemo(() => {
    return searchEngineIcons?.find((f) => f?.key === searchEngine?.use)?.url;
  }, [searchEngine?.use]);

  return (
    <Animation
      visible={searchEngine?.show}
      animateHeight={true}
      animateOnMount={true}
    >
      <div className="py-8 w-full">
        <div ref={containerRef} className="relative mx-auto w-full max-w-180">
          <div ref={triggerRef} className="relative w-full h-11.5">
            <input
              ref={inputRef}
              className="py-2 pl-12 pr-22 text-[var(--c-text-color)] text-3.75 w-full h-full leading-tight bg-[var(--c-bg-color-35)] hover:bg-[var(--c-bg-color-50)] backdrop-blur-3 border-none outline-none rounded-full transition-colors duration-250"
              value={searchValue}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onKeyDown={handleSearchKeyDown}
              onChange={handleSearchChange}
            />

            {/*搜索引擎*/}
            <div className="absolute top-50% left-2 -translate-y-50% space-x-2 flex items-center pointer-events-none">
              <button
                className="w-8 h-8 bg-transparent hover:bg-[var(--c-bg-color-15)] border-none outline-none rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-colors"
                onClick={() => setEngineVisible(!engineVisible)}
              >
                <Image
                  className="shrink-0 w-5.5 h-5.5 pointer-events-none select-none"
                  loadingRounded={true}
                  src={searchEngineLogo}
                />
              </button>
            </div>

            {/*Operate*/}
            <div className="absolute top-50% right-2 -translate-y-50% space-x-2 flex items-center pointer-events-none">
              {!!searchValue && (
                <button
                  className="w-8 h-8 bg-transparent hover:bg-[var(--c-bg-color-15)] border-none outline-none rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-colors"
                  onClick={clear}
                >
                  <div className="i-iconamoon:close w-5 h-5 text-[var(--c-text-color-75)]"></div>
                </button>
              )}
              <button className="w-8 h-8 bg-transparent hover:bg-[var(--c-bg-color-15)] border-none outline-none rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-colors">
                <div className="i-iconamoon:search w-5 h-5 text-[var(--c-text-color-75)] transition-[color]"></div>
              </button>
            </div>
          </div>

          {/*搜索引擎*/}
          <SearchEngine
            ref={engineRef}
            containerRef={containerRef}
            visible={engineVisible}
            onChange={() => setEngineVisible(false)}
          />

          {/*搜索结果*/}
          <ResultList
            ref={resultRef}
            visible={resultVisible}
            offset={offset}
            list={resultList}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
    </Animation>
  );
};
