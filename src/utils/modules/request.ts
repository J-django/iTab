import { createAxiosInstance } from "./axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type { AxiosOptions } from "./axios";

export class Request {
  private axiosInstance: AxiosInstance;
  private controllers = new Map<string, AbortController>();

  constructor(options: AxiosOptions) {
    this.axiosInstance = createAxiosInstance(options);
  }

  /**
   * 生成唯一 key
   */
  private getRequestKey(config: AxiosRequestConfig): string {
    const method = config.method ?? "get";
    const url = config.url ?? "";

    // 确保序列化参数一致性
    const params = config.params ? JSON.stringify(config.params) : "";
    const data = config.data ? JSON.stringify(config.data) : "";

    return `${method}:${url}?params=${params}&data=${data}`;
  }

  /**
   * 取消指定请求
   */
  cancelRequest(config: AxiosRequestConfig) {
    const key = this.getRequestKey(config);
    const controller = this.controllers.get(key);
    if (controller) {
      controller.abort();
      this.controllers.delete(key);
    }
  }

  /**
   * 取消所有请求
   */
  cancelAll() {
    this.controllers.forEach((c) => c.abort());
    this.controllers.clear();
  }

  request<T = any>(config: AxiosRequestConfig) {
    const controller = new AbortController();

    const promise: any = this.axiosInstance.request<T>({
      ...config,
      signal: controller.signal,
    });

    promise.cancel = () => controller.abort();

    return promise as Promise<AxiosResponse<T>> & { cancel: () => void };
  }

  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "GET", url });
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "DELETE", url });
  }
}
