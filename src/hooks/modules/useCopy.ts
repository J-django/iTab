import { useCallback, RefObject } from "react";
import { toast } from "sonner";
import copy from "copy-to-clipboard";

interface CopyOptions {
  showMessage?: boolean; // 是否显示提示信息
  successMsg?: string; // 成功提示
  errorMsg?: string; // 失败提示
  emptyMsg?: string; // 内容为空提示
  onSuccess?: (text: string) => void; // 成功回调
  onError?: (text: string) => void; // 失败回调
  normalizeText?: (text: string) => string; // 可选文本处理函数，例如去掉多余空格
}

type CopyTarget =
  | string
  | RefObject<HTMLElement>
  | HTMLElement
  | null
  | undefined;

export function useCopy(options?: CopyOptions) {
  const {
    showMessage = true,
    successMsg = "复制成功",
    errorMsg = "复制失败，请手动复制",
    emptyMsg = "没有可复制的内容",
    onSuccess,
    onError,
    normalizeText,
  } = options || {};

  const copyText = useCallback(
    (target: CopyTarget): boolean => {
      let text: string | undefined;

      if (!target) {
        text = "";
      } else if (typeof target === "string") {
        text = target;
      } else if ("current" in target && target.current) {
        text = target.current.innerText || target.current.textContent || "";
      } else if (target instanceof HTMLElement) {
        text = target.innerText || target.textContent || "";
      } else {
        text = "";
      }

      if (normalizeText) {
        text = normalizeText(text);
      }

      if (!text) {
        if (showMessage) toast.warning(emptyMsg);
        onError?.(text || "");
        return false;
      }

      const isSuccess = copy(text, {
        debug: true,
        message: "请手动按 Ctrl+C 复制",
      });

      if (showMessage) {
        if (isSuccess) {
          toast.success(successMsg);
        } else {
          toast.error(errorMsg);
        }
      }

      if (isSuccess) {
        onSuccess?.(text);
      } else {
        onError?.(text);
      }

      return isSuccess;
    },
    [
      showMessage,
      successMsg,
      errorMsg,
      emptyMsg,
      onSuccess,
      onError,
      normalizeText,
    ],
  );

  return copyText;
}
