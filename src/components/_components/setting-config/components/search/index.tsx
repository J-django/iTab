import List from "@/components/list";
import { Switch } from "antd";
import { Button } from "@/components/button";
import { useConfigStore } from "@/store";

const Search = () => {
  const { searchEngine, setSearchVisible, clearSearchHistory } =
    useConfigStore();
  const historyCount = searchEngine?.history?.length || 0;
  const currentEngine = searchEngine?.list?.find(
    (item) => item.key === searchEngine?.use,
  );
  const historyPreview = (searchEngine?.history || []).slice(0, 6);

  return (
    <List>
      <List.Item
        title="显示搜索框"
        content={
          <Switch
            className="config-switch"
            value={searchEngine?.show}
            onChange={setSearchVisible}
          />
        }
      />

      <List.Item
        title="默认搜索引擎"
        describe={currentEngine?.url || "当前还没有可用搜索引擎"}
        content={
          <div className="max-w-52 truncate text-[13px] text-[var(--c-text-color-60)]">
            {currentEngine?.title || "未设置"}
          </div>
        }
      />

      <List.Item
        title="最近搜索"
        describe={
          historyCount > 0
            ? `当前已记录 ${historyCount} 条搜索历史`
            : "当前还没有搜索历史"
        }
        content={
          <Button disabled={historyCount === 0} onClick={clearSearchHistory}>
            清空历史
          </Button>
        }
      />

      <List.Item className="block!">
        <div className="space-y-2">
          <div className="text-[13px] text-[var(--c-text-color)]">
            最近搜索预览
          </div>

          {historyPreview.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {historyPreview.map((keyword) => (
                <span
                  key={keyword}
                  className="max-w-44 truncate rounded-1.25 bg-[var(--c-bg-color-25)] px-2.5 py-1 text-[12px] text-[var(--c-text-color-60)]"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-[12px] text-[var(--c-text-color-45)]">
              在首页搜索几次后，这里会显示最近使用过的关键词。
            </div>
          )}
        </div>
      </List.Item>
    </List>
  );
};

export default Search;
