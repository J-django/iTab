import type { MouseEventHandler, ReactElement } from "react";
import type { ModalProps } from "@/components/modal";

export type EditSearchEngineTriggerProps = {
  onClick?: MouseEventHandler<HTMLElement>;
  initial?: string;
  animate?: string;
  exit?: string;
};

export type EditSearchEngineProps = {
  getContainer: ModalProps["getContainer"];
  children: ReactElement<EditSearchEngineTriggerProps>;
};
