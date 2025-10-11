import { useRef, useState } from "react";
import { Popover } from "antd";
import { useClickOutside } from "@/hooks";
import { iconLibrary } from "@/constant";
import { generateId, nextTick } from "@/utils";
import { clsx } from "clsx";

import { SettingNavProps, IconProps } from "../types";

const DEFAULT_ICON = iconLibrary[0];
const DEFAULT_NAME = "NewTab";

export const SettingNav = (props: SettingNavProps) => {
  const { children, onOk } = props;

  // Ref
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  // State
  const [localIcon, setLocalIcon] = useState(DEFAULT_ICON);
  const [localName, setLocalName] = useState(DEFAULT_NAME);
  const [visible, setVisible] = useState(false);

  // Func
  function reset() {
    setLocalIcon(DEFAULT_ICON);
    setLocalName(DEFAULT_NAME);
  }

  function clear() {
    setLocalName("");
  }

  function cancel() {
    setVisible(false);
    reset();
  }

  function handleSubmit() {
    onOk({ id: generateId(), name: localName, icon: localIcon, children: [] });
    cancel();
  }

  useClickOutside([nodeRef, triggerRef], () => nextTick(() => cancel()));

  return (
    <Popover
      {...props}
      open={visible}
      arrow={false}
      placement="leftBottom"
      content={
        <div
          ref={nodeRef}
          className="space-y-3 p-3 bg-[var(--c-bg-color-50)] rounded-3"
        >
          {/*图标列表*/}
          <ul className="-mx-0.6 my-0 p-0 list-none grid grid-cols-7">
            {iconLibrary.map((icon, index: number) => (
              <Icon
                key={index}
                icon={icon}
                checked={localIcon === icon}
                onClick={setLocalIcon}
              />
            ))}
          </ul>

          {/*输入框*/}
          <div className="relative w-full pointer-events-none">
            <input
              className="pl-2 pr-6 py-1px text-3.5 text-[var(--c-text-color)] placeholder:text-[var(--c-text-color-75)] w-full h-6.5 leading-normal bg-[var(--c-bg-color-30)] rounded-full border-none outline-none hover:shadow-[0_0_0_1px_var(--c-text-color-75)] focus:shadow-[0_0_0_1px_var(--c-text-color-75)] transition-[box-shadow] duration-350 pointer-events-auto"
              placeholder="名称"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
            />
            {!!localName && (
              <span className="absolute top-50% right-0.35 -translate-y-50% pointer-events-none">
                <div
                  className="flex items-center justify-center cursor-pointer pointer-events-auto"
                  onClick={clear}
                >
                  <div className="i-ic:round-cancel m-1 w-4 h-4 text-[var(--c-text-color-85)]"></div>
                </div>
              </span>
            )}
          </div>

          {/*执行操作*/}
          <div className="space-x-3 flex items-center">
            <button
              className="px-2.5 text-3.5 text-[var(--c-text-color)] w-full h-7.5 leading-normal bg-[var(--c-bg-color-50)] border-none rounded-full cursor-pointer active:scale-95 transition-transform duration-250"
              onClick={cancel}
            >
              取消
            </button>
            <button
              className="px-2.5 text-3.5 text-#dfdfd7 w-full h-7.5 leading-normal bg-#0078f8 border-none rounded-full cursor-pointer active:scale-95 transition-transform duration-250"
              onClick={handleSubmit}
            >
              保存
            </button>
          </div>
        </div>
      }
      children={
        <div
          ref={triggerRef}
          className={clsx(
            "flex items-center justify-center transition-colors duration-250",
            { "text-#dfdfd7": visible },
          )}
          onClick={() => setVisible(!visible)}
        >
          {children}
        </div>
      }
      styles={{
        body: {
          marginLeft: 4,
          padding: 0,
          boxShadow: "none",
          backgroundColor: "transparent",
          backgroundClip: "inherit",
          borderRadius: 0,
        },
      }}
    />
  );
};

const Icon = ({ icon, checked, onClick }: IconProps) => {
  return (
    <li
      className={clsx(
        "relative m-0.6 w-7.25 h-7.25 leading-normal text-[var(--c-text-color-85)] hover:bg-[var(--c-text-color-20)] flex items-center justify-center rounded-1 cursor-pointer transition-colors duration-250",
        { "bg-[var(--c-text-color-20)]": checked },
      )}
      onClick={() => onClick(icon)}
    >
      <div className={clsx("w-5.5 h-5.5 leading-5.5", icon)}></div>
    </li>
  );
};
