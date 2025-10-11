import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    requestOptions?: {
      errorMessage?: boolean;
    };
  }
}
