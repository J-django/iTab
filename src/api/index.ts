import { request } from "./modules/request";
import { getApiURL } from "@/utils";

export function search(param: string) {
  return request.get(
    `${getApiURL()}/sugrec?&prod=pc&wd=${encodeURIComponent(param)}`,
  );
}
