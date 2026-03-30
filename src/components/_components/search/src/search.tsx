import { useRef, useState, useMemo, useEffect } from "react";
import Animation from "@/components/animation";
import { GlassSurface } from "@/components/glass-surface";
import Image from "@/components/image";
import ResultList from "../components/result-list";
import SearchEngine from "../components/search-engine";
import { useConfigStore } from "@/store";
import { useRequest } from "ahooks";
import { search } from "@/api";
import { useClickOutside } from "@/hooks";
import { DEFAULT_OFFSET } from "../constant";
import { orDefault, getNextIndex, nextTick } from "@/utils";
import { buildSearchUrl, getSearchEngine, getSearchEngineIcon } from "../utils";
import { debounce } from "lodash-es";

import { ChangeEvent, KeyboardEvent } from "react";
import type { SearchResult } from "../types";

export const Search = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const engineRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const latestKeywordRef = useRef("");

  const [engineVisible, setEngineVisible] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const [resultList, setResultList] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { searchEngine, addSearchHistory } = useConfigStore();
  const { run: runSearch } = useRequest(search, {
    manual: true,
    onSuccess(res: any, params) {
      const requestKeyword = params?.[0]?.trim() || "";
      if (requestKeyword !== latestKeywordRef.current.trim()) {
        return;
      }

      const list: SearchResult[] = res?.g || [];

      if (list?.length) {
        setResultList(list);
        setSelectedIndex(-1);
        setResultVisible(true);
      } else {
        resetSearch();
      }

      if (engineVisible) {
        const height = orDefault(engineRef.current?.clientHeight, 0);
        setOffset(height + DEFAULT_OFFSET * 2 || DEFAULT_OFFSET);
      }
    },
  });

  function resetSearch() {
    setResultList([]);
    setSelectedIndex(-1);
    setResultVisible(false);
  }

  function clear() {
    onSearch.cancel();
    latestKeywordRef.current = "";
    setSearchValue("");
    resetSearch();
  }

  function submitSearch(targetValue?: string) {
    const keyword = (targetValue || searchValue).trim();
    const url = buildSearchUrl(searchEngine?.use, keyword, searchEngine?.list);

    if (!url) {
      return;
    }

    addSearchHistory(keyword);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const onSearch = useMemo(() => {
    return debounce((value: string) => {
      if (value) {
        runSearch(value);
      } else {
        setResultList([]);
        setSelectedIndex(-1);
        setResultVisible(false);
      }
    }, 100);
  }, [runSearch]);

  useEffect(() => {
    return () => onSearch.cancel();
  }, [onSearch]);

  const historyList = useMemo(() => {
    return (searchEngine?.history || []).map((item) => ({ q: item }));
  }, [searchEngine?.history]);

  const showingHistory = !searchValue.trim();
  const activeList = showingHistory ? historyList : resultList;

  useEffect(() => {
    if (engineVisible) {
      const height = orDefault(engineRef.current?.clientHeight, 0);
      setOffset(height + DEFAULT_OFFSET * 2 || DEFAULT_OFFSET);
      return;
    }

    setOffset(DEFAULT_OFFSET);
  }, [engineVisible]);

  function handleSearchFocus() {
    if (activeList?.length) {
      setResultVisible(true);
    }
  }

  function handleSearchBlur() {
    setResultVisible(false);
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    latestKeywordRef.current = value;
    setSearchValue(value);
    setSelectedIndex(-1);

    if (!value.trim()) {
      onSearch.cancel();
      setResultVisible(historyList.length > 0);
      return;
    }

    onSearch(value);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (selectedIndex === -1) {
        submitSearch();
      } else {
        const param = orDefault(activeList?.[selectedIndex]?.q, searchValue);
        submitSearch(param);
      }
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      nextTick(() => {
        const len = inputRef.current?.value?.length || 0;
        inputRef.current?.setSelectionRange(len, len);
      });
      setSelectedIndex((prev) => getNextIndex(prev, "up", activeList.length));
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) => getNextIndex(prev, "down", activeList.length));
    }
  }

  useClickOutside([containerRef, triggerRef, engineRef, resultRef], () => {
    setEngineVisible(false);
    setResultVisible(false);
  });

  const searchEngineLogo = useMemo(() => {
    return getSearchEngineIcon(searchEngine?.use);
  }, [searchEngine?.use]);

  const searchEngineTitle = useMemo(() => {
    return (
      getSearchEngine(searchEngine?.use, searchEngine?.list)?.title ||
      "当前搜索引擎"
    );
  }, [searchEngine?.list, searchEngine?.use]);

  return (
    <Animation
      visible={searchEngine?.show}
      animateHeight={true}
      animateOnMount={true}
    >
      <div className="py-8 w-full">
        <div ref={containerRef} className="relative mx-auto w-full max-w-180">
          <div ref={triggerRef} className="relative w-full h-13">
            <GlassSurface
              width="100%"
              height="100%"
              backgroundOpacity={0.15}
              borderRadius={50}
              saturation={1.5}
              borderWidth={0}
              brightness={50}
              opacity={0.93}
              blur={8}
              displace={1.2}
              distortionScale={-180}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              mixBlendMode="screen"
              contentClassName="p-0!"
            >
              <div className="relative w-full h-full">
                <input
                  ref={inputRef}
                  className="py-2 pl-14 pr-24 text-#ffffff/75 placeholder:text-#ffffff/30 text-3.75 w-full h-full leading-tight bg-transparent border-none outline-none rounded-full"
                  placeholder={`使用 ${searchEngineTitle} 搜索`}
                  value={searchValue}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  onKeyDown={handleSearchKeyDown}
                  onChange={handleSearchChange}
                />

                <div className="absolute top-50% left-2 -translate-y-50% space-x-2 flex items-center pointer-events-none">
                  <button
                    className="shrink-0 w-9 h-9 bg-transparent hover:bg-white/10 border-none outline-none rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-colors"
                    onClick={() => setEngineVisible(!engineVisible)}
                  >
                    <Image
                      className="shrink-0 w-6 h-6 pointer-events-none select-none"
                      loadingRounded={true}
                      src={searchEngineLogo}
                    />
                  </button>
                </div>

                {/*Operate*/}
                <div className="absolute top-50% right-2 -translate-y-50% space-x-1.5 flex items-center pointer-events-none">
                  {!!searchValue && (
                    <button
                      className="shrink-0 w-9 h-9 bg-transparent hover:bg-white/10 border-none outline-none rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-colors"
                      onClick={clear}
                    >
                      <div className="i-mi:close w-6 h-6 text-#ffffff/60"></div>
                    </button>
                  )}
                  <button className="shrink-0 w-9 h-9 bg-transparent hover:bg-white/10 border-none outline-none rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-colors">
                    <div className="i-iconamoon:search w-6 h-6 text-#ffffff/60"></div>
                  </button>
                </div>
              </div>
            </GlassSurface>
          </div>

          <SearchEngine
            ref={engineRef}
            containerRef={containerRef}
            visible={engineVisible}
            onChange={() => setEngineVisible(false)}
          />

          <ResultList
            ref={resultRef}
            visible={resultVisible && activeList.length > 0}
            offset={offset}
            list={activeList}
            selectedIndex={selectedIndex}
            headerText={showingHistory ? "最近搜索" : undefined}
            searchEngineUse={searchEngine?.use}
            searchEngineList={searchEngine?.list}
          />
        </div>
      </div>
    </Animation>
  );
};
