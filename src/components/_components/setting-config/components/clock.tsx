import List from "@/components/list";
import { Switch, Slider, ColorPicker } from "antd";
import { useConfigStore } from "@/store";
import { clsx } from "clsx";

const Clock = () => {
  // hooks
  const { getClock, setClock } = useConfigStore();
  const clock = getClock();

  return (
    <List>
      {/*显示时钟*/}
      <List.Item
        title="显示时钟"
        content={
          <Switch
            className="config-switch"
            value={clock?.show}
            onChange={(checked) => setClock({ show: checked })}
          />
        }
      />

      {/*显示秒钟*/}
      <List.Item
        title="秒钟"
        content={
          <Switch
            className="config-switch"
            value={clock?.second}
            disabled={!clock?.show}
            onChange={(checked) => setClock({ second: checked })}
          />
        }
      />

      {/*显示农历*/}
      <List.Item
        title="农历"
        content={
          <Switch
            className="config-switch"
            value={clock?.lunar}
            disabled={!clock?.show}
            onChange={(checked) => setClock({ lunar: checked })}
          />
        }
      />

      {/*24小时制*/}
      <List.Item
        title="24小时制"
        content={
          <Switch
            className="config-switch"
            value={clock?.hover24}
            disabled={!clock?.show}
            onChange={(checked) => setClock({ hover24: checked })}
          />
        }
      />

      {/*显示星期*/}
      <List.Item
        title="星期"
        content={
          <Switch
            className="config-switch"
            value={clock?.week}
            disabled={!clock?.show}
            onChange={(checked) => setClock({ week: checked })}
          />
        }
      />

      {/*显示日期*/}
      <List.Item
        title="日期"
        content={
          <Switch
            className="config-switch"
            value={clock?.date}
            disabled={!clock?.show}
            onChange={(checked) => setClock({ date: checked })}
          />
        }
      />

      {/*显示粗体*/}
      <List.Item
        title="粗体"
        content={
          <Switch
            className="config-switch"
            value={clock?.bold}
            disabled={!clock?.show}
            onChange={(checked) => setClock({ bold: checked })}
          />
        }
      />

      {/*字体大小*/}
      <List.Item
        title="字体大小"
        content={
          <Slider
            className="config-slider mx-0 w-50"
            min={30}
            max={130}
            value={clock?.size}
            disabled={!clock?.show}
            onChange={(value) => setClock({ size: value })}
          />
        }
      />

      {/*字体颜色*/}
      <List.Item
        title="字体颜色"
        content={
          <div className="space-x-2 flex items-center">
            <div
              className={clsx("relative w-20", {
                "cursor-not-allowed [&>*]:cursor-inherit opacity-75":
                  !clock?.show,
              })}
            >
              <span className="absolute top-50% left-1.5 -translate-y-50% text-4 text-[var(--c-text-color-85)] leading-tight pointer-events-none select-none transition-[color]">
                #
              </span>
              <input
                className="pl-4 text-3.75 text-[var(--c-text-color-85)] text-center w-full h-6 leading-none bg-[var(--c-bg-color)] border border-solid border-[var(--c-border-color)] rounded-1.25 outline-none"
                maxLength={6}
                value={clock?.color?.toUpperCase()?.replace("#", "")}
                disabled={!clock?.show}
                onChange={(e) =>
                  setClock({ color: `#${e.target.value?.toUpperCase()}` })
                }
              />
            </div>

            {/*颜色选择器*/}
            <ColorPicker
              arrow={false}
              size="small"
              format="hex"
              mode="single"
              defaultFormat="hex"
              value={clock?.color}
              disabledAlpha={true}
              disabledFormat={true}
              disabled={!clock?.show}
              rootClassName="config-color-picker"
              onChange={(color) =>
                setClock({ color: `#${color.toHex()?.toUpperCase()}` })
              }
            >
              <div
                className={clsx(
                  "w-5.5 h-5.5 border border-solid border-[var(--c-border-color)] rounded-1.25 cursor-pointer transition-colors",
                  {
                    "cursor-not-allowed [&>*]:cursor-inherit opacity-75":
                      !clock?.show,
                  },
                )}
                style={{ backgroundColor: clock?.color }}
              ></div>
            </ColorPicker>
          </div>
        }
      />
    </List>
  );
};

export default Clock;
