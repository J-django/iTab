import List from "@/components/list";
import { Switch } from "antd";
import { useConfigStore } from "@/store";

const Search = () => {
  // Hooks
  const { searchEngine, setSearchVisible } = useConfigStore();

  return (
    <List>
      {/*显示搜索框*/}
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
    </List>
  );
};

export default Search;
