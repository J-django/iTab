import List from "@/components/list";
import Image from "@/components/image";
import { useConfigStore } from "@/store";
import { themes } from "@/constant";
import { clsx } from "clsx";
import { ColorPicker } from "antd";

const Theme = () => {
  // Hooks
  const { theme, setMode, setTheme } = useConfigStore();

  return (
    <List>
      {/*主题*/}
      <List.Item
        title="主题"
        content={
          <div className="space-x-3 flex items-center flex-wrap">
            {themes.map((m) => (
              <div
                key={m.name}
                className={clsx(
                  "relative w-28 lg:w-36 flex flex-col flex-nowrap border border-solid rounded-2 cursor-pointer overflow-hidden hover:opacity-75 transition-[width,border-color,opacity] duration-250",
                  [
                    theme?.mode === m.name
                      ? "border-#0d6efd/75"
                      : "border-[var(--c-border-color)]",
                  ],
                )}
                onClick={() => setMode(m.name)}
              >
                <Image
                  className="w-full h-15 lg:h-20 transition-height"
                  src={m.image}
                  imageStyle={{
                    objectFit: "cover",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
                <div
                  className={clsx(
                    "px-1 lg:px-1.5 py-0.75 lg:py-1 text-2.75 lg:text-3 shrink-0 flex items-center justify-between transition-[padding,font-size]",
                    { "bg-#0d6efd/15": theme?.mode === m.name },
                  )}
                >
                  <span className="leading-none select-none">{m.title}</span>
                  <div
                    className={clsx(
                      "size-3 lg:size-4 border border-solid flex items-center justify-center rounded-full transition-[width,height,border-color]",
                      [
                        theme?.mode === m.name
                          ? "text-white bg-#0d6efd border-#0d6efd"
                          : "border-[var(--c-border-color)]",
                      ],
                    )}
                  >
                    {theme?.mode === m.name && (
                      <div className="i-mingcute:check-fill w-2.5 h-2.5"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      />

      {/*强调色*/}
      <List.Item
        title="强调色"
        content={
          <div className="space-x-2 flex items-center">
            <div className="relative w-20">
              <span className="absolute top-50% left-1.5 -translate-y-50% text-4 text-[var(--c-text-color-85)] leading-tight pointer-events-none select-none transition-[color]">
                #
              </span>
              <input
                className="pl-4 text-3.75 text-[var(--c-text-color-85)] text-center w-full h-6 leading-tight bg-[var(--c-bg-color)] border border-solid border-[var(--c-border-color)] rounded-1.25 outline-none transition-colors"
                maxLength={6}
                value={theme?.color?.toUpperCase()?.replace("#", "")}
                onChange={(e) =>
                  setTheme({ color: `#${e.target.value?.toUpperCase()}` })
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
              value={theme?.color}
              disabledAlpha={true}
              disabledFormat={true}
              rootClassName="config-color-picker"
              onChange={(color) =>
                setTheme({ color: `#${color.toHex()?.toUpperCase()}` })
              }
            >
              <div
                className="w-5.5 h-5.5 border border-solid border-[var(--c-border-color)] rounded-1.25 cursor-pointer transition-colors"
                style={{ backgroundColor: theme?.color }}
              ></div>
            </ColorPicker>
          </div>
        }
      />
    </List>
  );
};

export default Theme;
