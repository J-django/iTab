import List from "@/components/list";
import { Button } from "@/components/button";
import { useConfigStore, useNavStore } from "@/store";

const Reset = () => {
  // Hooks
  const { resetConfig } = useConfigStore();
  const { resetNav } = useNavStore();

  return (
    <List>
      {/*重置配置*/}
      <List.Item
        title="重置配置"
        describe="重置成默认配置，如墙纸、布局，但不会重置图标"
        content={<Button onClick={resetConfig}>重置</Button>}
      />

      {/*重置重置图标*/}
      <List.Item
        title="重置图标"
        describe="重置您的图标成默认"
        content={<Button onClick={resetNav}>重置</Button>}
      />
    </List>
  );
};

export default Reset;
