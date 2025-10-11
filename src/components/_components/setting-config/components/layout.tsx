import List from "@/components/list";
import { Switch } from "antd";
import { useConfigStore } from "@/store";

const Layout = () => {
  // Hooks
  const { layout, setSidebar } = useConfigStore();

  return (
    <List>
      {/*显示侧边栏*/}
      <List.Item
        title="显示侧边栏"
        content={
          <Switch
            className="config-switch"
            value={layout?.sidebar?.visible}
            onChange={(checked) => setSidebar({ visible: checked })}
          />
        }
      />

      {/*侧边栏*/}
      <List.Item
        title="侧边栏左侧"
        content={
          <Switch
            className="config-switch"
            value={layout?.sidebar?.placement === "left"}
            onChange={(checked) =>
              setSidebar({ placement: checked ? "left" : "right" })
            }
          />
        }
      />
    </List>
  );
};

export default Layout;
