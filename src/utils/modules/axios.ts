import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export type AxiosOptions = {
  baseURL?: string;

  beforeRequestHook?: (
    config: AxiosRequestConfig,
  ) => AxiosRequestConfig | Promise<AxiosRequestConfig>;

  beforeResponseHook?: (
    response: AxiosResponse,
  ) => AxiosResponse | Promise<AxiosResponse>;

  onError?: (error: {
    type: string;
    url: string;
    status: number;
    message: string;
    originalError: any;
  }) => void;
};

export const createAxiosInstance = (options: AxiosOptions): AxiosInstance => {
  const instance = axios.create({
    baseURL: options.baseURL,
    timeout: 15000,
  });

  // 请求拦截
  instance.interceptors.request.use(
    async (config) => {
      if (options.beforeRequestHook) {
        await options.beforeRequestHook(config);
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // 响应拦截
  instance.interceptors.response.use(
    async (response) => {
      if (options.beforeResponseHook) {
        return options.beforeResponseHook(response);
      }
      return response;
    },
    (error) => {
      const isCanceled =
        axios.isCancel(error) || error?.code === "ERR_CANCELED";

      const errorInfo = {
        type: isCanceled ? "cancel" : "network",
        url: error?.config?.url ?? "unknown",
        status: error?.response?.status ?? 0,
        message:
          error?.message ?? (isCanceled ? "Request canceled" : "Unknown error"),
        originalError: error,
      };

      // 调用 onError，无论是取消还是网络错误
      options.onError?.(errorInfo);

      if (isCanceled) {
        // 取消请求：不抛异常，也不返回任何值
        return new Promise(() => {}); // 永远 pending
      }

      // 普通网络错误
      return Promise.reject(new Error(JSON.stringify(errorInfo)));
    },
  );

  return instance;
};
