import { useRef, useState } from "react";
import { Popover } from "antd";
import { GlassSurface } from "@/components/glass-surface";
import { useClickOutside } from "@/hooks";
import { generateId, nextTick } from "@/utils";
import { clsx } from "clsx";
import { NavForm } from "./nav-form";

import { SettingNavProps } from "../types";

export const SettingNav = (props: SettingNavProps) => {
  const { children, onOk } = props;

  // Ref
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  // State
  const [visible, setVisible] = useState(false);

  // Func
  function cancel() {
    setVisible(false);
  }

  function handleSubmit(draft: { name: string; icon: string }) {
    onOk({
      id: generateId(),
      name: draft.name,
      icon: draft.icon,
      children: [],
    });
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
        <div ref={nodeRef}>
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={24}
            backgroundOpacity={0.16}
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
            className="w-full"
            contentClassName="p-0! items-stretch! justify-start!"
          >
            <div className="p-3">
              <NavForm onSubmit={handleSubmit} onCancel={cancel} />
            </div>
          </GlassSurface>
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
