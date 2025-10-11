import { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { BASE_SIZE, BASE_GAP, generateLayouts } from "../utils";

import type { Layout } from "react-grid-layout";
import type { LaunchpadProps, LaunchpadLayouts } from "../types";
import { App } from "@/types";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const Launchpad = (props: LaunchpadProps) => {
  // Props
  const { cols = {}, initialApps = [], onChange } = props;

  // State
  const [apps] = useState<App[]>(initialApps);
  const [layouts] = useState<LaunchpadLayouts>(generateLayouts(apps, cols));

  // Func
  const handleLayoutChange = (newLayout: Layout[]) => {
    onChange?.(apps, newLayout);
  };

  return (
    <div className="pt-3 w-full">
      <div className="mx-auto w-full">
        <ResponsiveGridLayout
          className="sidebar-grid-layout"
          cols={cols}
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
          rowHeight={BASE_SIZE}
          isResizable={false}
          isDraggable={true}
          margin={[BASE_GAP, BASE_GAP]}
          containerPadding={[0, 0]}
          onLayoutChange={handleLayoutChange}
        >
          {apps.map((app) => (
            <div
              key={app.id}
              className="p-3 w-full h-full bg-red flex flex-col items-center justify-center"
            ></div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};
