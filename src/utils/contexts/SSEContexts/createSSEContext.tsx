import { ReactNode, useEffect, useState, createContext } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import Cookies from 'js-cookie';

type SSEContextType = {
  batchingMemoCount: number;
  connect: (
    url: string,
    onResetWhenNoBatchingMemo: () => void,
    onReset: () => void
  ) => void;
  disconnect: () => void;
  isConnected: boolean;
};

export const createSSEContext = () => {
  const SSEContext = createContext<SSEContextType>({
    batchingMemoCount: 0,
    connect: () => {},
    disconnect: () => {},
    isConnected: false,
  });

  const SSEProvider = ({ children }: { children: ReactNode }) => {
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [batchingMemoCount, setBatchingMemoCount] = useState(0);
    const [reconnectInterval, setReconnectInterval] = useState<number | null>(null);

    const connect = (
      url: string,
      onResetWhenNoBatchingMemo: () => void,
      onReset: () => void
    ) => {
      if (eventSource) {
        eventSource.close();
      }

      const newEventSource = new EventSourcePolyfill(url, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          Authorization: `Bearer ${Cookies.get('access_token')}`,
          withCredentials: 'true',
        },
      });

      newEventSource.onopen = () => {
        setIsConnected(true);
      };

      newEventSource.onmessage = (event) => {
        const newBatchingMemoCount = Number(event.data);

        if (newBatchingMemoCount === 0) {
          onResetWhenNoBatchingMemo();
        }
        setBatchingMemoCount(newBatchingMemoCount);
        onReset();
      };

      newEventSource.onerror = () => {
        setIsConnected(false);
        newEventSource.close();
        setEventSource(null);
      };

      setEventSource(newEventSource);
    };

    const disconnect = () => {
      if (eventSource) {
        eventSource.close();
        setEventSource(null);
        setIsConnected(false);
      }
    };

    const setupReconnection = (
      url: string,
      onResetWhenNoBatchingMemo: () => void,
      onReset: () => void
    ) => {
      disconnect();
      connect(url, onResetWhenNoBatchingMemo, onReset);
      const intervalId = setInterval(() => {
        disconnect();
        connect(url, onResetWhenNoBatchingMemo, onReset);
      }, 3300000);
      setReconnectInterval(intervalId);
    };

    const stopReconnection = () => {
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
        setReconnectInterval(null);
      }
    };

    useEffect(() => {
      return () => {
        disconnect();
        stopReconnection();
      };
    }, []);

    return (
      <SSEContext.Provider
        value={{
          batchingMemoCount,
          connect: setupReconnection,
          disconnect: () => {
            stopReconnection();
            disconnect();
          },
          isConnected,
        }}
      >
        {children}
      </SSEContext.Provider>
    );
  };

  return { SSEContext, SSEProvider };
};
