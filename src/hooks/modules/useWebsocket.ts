import { useEffect, useRef, useCallback } from "react";

interface WebSocketOptions {
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  maxRetries?: number;
  retryDelay?: number;
  manual?: boolean;
  queryParams?: Record<string, string>;
}

interface WebSocketHook {
  sendMessage: (data: unknown) => void;
  closeConnection: () => void;
  setParams: (newParams?: Record<string, string>) => void;
  ws: React.MutableRefObject<WebSocket | null>;
}

export const useWebSocket = (
  baseUrl: string,
  options: WebSocketOptions = {},
): WebSocketHook => {
  const {
    onOpen,
    onMessage,
    onError,
    onClose,
    maxRetries = 5,
    retryDelay = 3000,
    manual = false,
    queryParams,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const shouldReconnect = useRef<boolean>(true);
  const queryParamsRef = useRef<Record<string, string> | undefined>(
    queryParams,
  );

  // 把回调放到 ref，避免因为渲染导致 connect 重新创建
  const handlersRef = useRef({
    onOpen,
    onMessage,
    onError,
    onClose,
  });

  useEffect(() => {
    handlersRef.current = { onOpen, onMessage, onError, onClose };
  }, [onOpen, onMessage, onError, onClose]);

  const getWebSocketUrl = useCallback((): string => {
    if (
      !queryParamsRef.current ||
      Object.keys(queryParamsRef.current).length === 0
    ) {
      return baseUrl;
    }
    const params = new URLSearchParams(queryParamsRef.current).toString();
    return `${baseUrl}?${params}`;
  }, [baseUrl]);

  const connect = useCallback((): void => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(getWebSocketUrl());
    wsRef.current = ws;

    ws.onopen = (event) => {
      reconnectAttempts.current = 0;
      handlersRef.current.onOpen?.(event);
    };

    ws.onmessage = (event) => {
      handlersRef.current.onMessage?.(event);
    };

    ws.onerror = (event) => {
      handlersRef.current.onError?.(event);
    };

    ws.onclose = (event) => {
      handlersRef.current.onClose?.(event);
      if (shouldReconnect.current && reconnectAttempts.current < maxRetries) {
        reconnectAttempts.current += 1;
        setTimeout(connect, retryDelay);
      }
    };
  }, [getWebSocketUrl, maxRetries, retryDelay]);

  const closeConnection = useCallback((): void => {
    shouldReconnect.current = false;
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const setParams = useCallback(
    (newParams?: Record<string, string>): void => {
      shouldReconnect.current = true;
      reconnectAttempts.current = 0;
      if (newParams !== undefined) {
        queryParamsRef.current = newParams;
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(); // 触发 onclose 里会自动重连
      } else {
        connect();
      }
    },
    [connect],
  );

  const sendMessage = useCallback((data: unknown): void => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    if (!manual) {
      if (queryParams && Object.keys(queryParams).length > 0) {
        queryParamsRef.current = queryParams;
      }
      connect();
    }
    return () => {
      shouldReconnect.current = false;
      wsRef.current?.close();
    };
  }, [manual, queryParams, connect]);

  return { sendMessage, closeConnection, setParams, ws: wsRef };
};
