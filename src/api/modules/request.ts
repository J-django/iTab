import { Request } from "@/utils";
import { requestHeaderSetting, requestOptionsSetting } from "./request-utils";

import type { AxiosRequestConfig, AxiosResponse } from "axios";

export const request = new Request({
  baseURL: import.meta.env.VITE_API_BASEURL,
  beforeRequestHook: async (config: AxiosRequestConfig) => {
    requestHeaderSetting(config);
    requestOptionsSetting(config);
    return config;
  },
  beforeResponseHook: async (response: AxiosResponse) => {
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("网络错误");
    }
  },
});
