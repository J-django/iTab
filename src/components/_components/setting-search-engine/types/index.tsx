import type { ReactElement } from "react";
import type { ModalProps } from "@/components/modal";

export type EditSearchEngineProps = {
  getContainer: ModalProps["getContainer"];
  children: ReactElement;
};
