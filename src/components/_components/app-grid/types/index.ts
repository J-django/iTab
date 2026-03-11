import type { App } from "@/types";

export type AppGridProps = {
  apps: App[];
  onChange?: (apps: App[]) => void;
};
