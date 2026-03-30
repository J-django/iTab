import List from "@/components/list";
import Button from "@/components/button";
import { Switch } from "antd";
import { useConfigStore } from "@/store";

const Wallpaper = () => {
  // Hooks
  const { wallpaper, setWallpaper } = useConfigStore();

  return (
    <List>
      {/*遮罩*/}
      <List.Item
        title="遮罩"
        content={
          <Switch
            className="config-switch"
            value={wallpaper?.overlay}
            onChange={(checked) => setWallpaper({ overlay: checked })}
          />
        }
      />

      {/*模糊*/}
      <List.Item
        title="模糊"
        content={
          <Switch
            className="config-switch"
            value={wallpaper?.blur}
            onChange={(checked) => setWallpaper({ blur: checked })}
          />
        }
      />

      {/*自动切换*/}
      <List.Item
        title="自动切换"
        content={
          <div className="space-x-3 flex items-center">
            <Button disabled={!wallpaper?.auto}>切换</Button>

            <Switch
              className="config-switch"
              value={wallpaper?.auto}
              onChange={(checked) => setWallpaper({ auto: checked })}
            />
          </div>
        }
      />

      {/*墙纸*/}
      <div className=""></div>
    </List>
  );
};

export default Wallpaper;
