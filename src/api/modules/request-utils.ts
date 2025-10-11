import { requestOptions } from "./default";

import type { AxiosRequestConfig } from "axios";

// 请求头设置
export function requestHeaderSetting(config: AxiosRequestConfig) {
  config.headers = {
    "Content-Type": "application/json; charset=utf-8",
    ...config.headers,
  };
}

// 请求内部操作参数设置
export function requestOptionsSetting(config: AxiosRequestConfig) {
  config.requestOptions = {
    ...requestOptions,
    ...config.requestOptions,
  };
}
