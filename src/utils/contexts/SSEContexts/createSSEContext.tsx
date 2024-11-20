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
          Authorization: `Bearer ${Cookies.get('access_token')}`,
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

    useEffect(() => {
      return () => {
        disconnect();
      };
    }, []);

    return (
      <SSEContext.Provider
        value={{ batchingMemoCount, connect, disconnect, isConnected }}
      >
        {children}
      </SSEContext.Provider>
    );
  };

  return { SSEContext, SSEProvider };
};
