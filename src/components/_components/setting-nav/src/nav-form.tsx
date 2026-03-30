import { useEffect, useState } from "react";
import { toast } from "sonner";
import { iconLibrary } from "@/constant";
import { Scrollbars } from "react-custom-scrollbars-2";
import { clsx } from "clsx";
import type { IconProps, NavDraft } from "../types";

type NavFormProps = {
  value?: Partial<NavDraft>;
  submitText?: string;
  cancelText?: string;
  onSubmit: (draft: NavDraft) => void;
  onCancel: () => void;
};

const DEFAULT_ICON = iconLibrary[0];
const DEFAULT_NAME = "NewTab";

export const NavForm = ({
  value,
  submitText = "保存",
  cancelText = "取消",
  onSubmit,
  onCancel,
}: NavFormProps) => {
  const [localIcon, setLocalIcon] = useState(DEFAULT_ICON);
  const [localName, setLocalName] = useState(DEFAULT_NAME);

  useEffect(() => {
    setLocalIcon(value?.icon || DEFAULT_ICON);
    setLocalName(value?.name || DEFAULT_NAME);
  }, [value?.icon, value?.name]);

  const handleSubmit = () => {
    const name = localName.trim();

    if (!name) {
      toast.error("分类名称不能为空");
      return;
    }

    onSubmit({
      name,
      icon: localIcon || DEFAULT_ICON,
    });
  };

  return (
    <div className="space-y-3">
      <Scrollbars
        className="-mx-2.5 w-auto!"
        autoHeight={true}
        autoHeightMax={168}
        renderThumbVertical={({ style, ...props }) => (
          <div
            {...props}
            style={{ ...style }}
            className="bg-[var(--c-text-color-35)] hover:bg-[var(--c-text-color-45)] rounded-full transition-[background-color] duration-250 z-5"
          />
        )}
      >
        <ul className="my-0 px-2.5 p-0 list-none grid grid-cols-7">
          {iconLibrary.map((icon, index: number) => (
            <Icon
              key={index}
              icon={icon}
              checked={localIcon === icon}
              onClick={setLocalIcon}
            />
          ))}
        </ul>
      </Scrollbars>

      <div className="relative w-full pointer-events-none">
        <input
          className="pl-2 pr-6 py-1px text-3.5 text-[var(--c-text-color)] placeholder:text-[var(--c-text-color-75)] w-full h-6.5 leading-normal bg-[var(--c-bg-color-15)] rounded-full border-none outline-none hover:shadow-[0_0_0_1px_var(--c-text-color-75)] focus:shadow-[0_0_0_1px_var(--c-text-color-75)] transition-[box-shadow] duration-350 pointer-events-auto"
          placeholder="名称"
          value={localName}
          onChange={(event) => setLocalName(event.target.value)}
        />

        {!!localName && (
          <span className="absolute top-50% right-0.35 -translate-y-50% pointer-events-none">
            <div
              className="flex items-center justify-center cursor-pointer pointer-events-auto"
              onClick={() => setLocalName("")}
            >
              <div className="i-ic:round-cancel m-1 w-4 h-4 text-[var(--c-text-color-85)]"></div>
            </div>
          </span>
        )}
      </div>

      <div className="space-x-3 flex items-center">
        <button
          className="px-2.5 text-3.5 text-[var(--c-text-color)] w-full h-7.5 leading-normal bg-[var(--c-bg-color-50)] border-none rounded-full cursor-pointer active:scale-95 transition-transform duration-250"
          onClick={onCancel}
        >
          {cancelText}
        </button>
        <button
          className="px-2.5 text-3.5 text-#dfdfd7 w-full h-7.5 leading-normal bg-#0078f8 border-none rounded-full cursor-pointer active:scale-95 transition-transform duration-250"
          onClick={handleSubmit}
        >
          {submitText}
        </button>
      </div>
    </div>
  );
};

const Icon = ({ icon, checked, onClick }: IconProps) => {
  return (
    <li
      className={clsx(
        "relative m-0.6 w-7.25 h-7.25 leading-normal text-#ffffff/50 hover:bg-#ffffff/15 flex items-center justify-center rounded-1 cursor-pointer transition-colors duration-250",
        { "bg-[var(--c-text-color-20)]": checked },
      )}
      onClick={() => onClick(icon)}
    >
      <div className={clsx("w-5.5 h-5.5 leading-5.5", icon)}></div>
    </li>
  );
};
