import { createContext, useContext } from "react";

import type { ProviderProps } from "react";
import type { Config } from "@/types";

const ConfigContext = createContext<Config | undefined>(undefined);

export const ConfigProvider = ({ value, children }: ProviderProps<Config>) => {
  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
