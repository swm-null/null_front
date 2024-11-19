import React, { ReactNode, useEffect, useState } from 'react';

const createSSEContext = () => {
  const SSEContext = React.createContext<{
    connect: (url: string, onReset: () => void) => void;
    disconnect: () => void;
    isConnected: boolean;
  } | null>(null);

  const SSEProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const connect = (url: string, onReset: () => void) => {
      if (eventSource) {
        eventSource.close();
      }

      const newEventSource = new EventSource(url);

      newEventSource.onopen = () => {
        setIsConnected(true);
      };

      newEventSource.onmessage = () => {
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
      <SSEContext.Provider value={{ connect, disconnect, isConnected }}>
        {children}
      </SSEContext.Provider>
    );
  };

  return { SSEContext, SSEProvider };
};

export const { SSEContext: CreateSSEContext, SSEProvider: CreateSSEProvider } =
  createSSEContext();

export const { SSEContext: SearchSSEContext, SSEProvider: SearchSSEProvider } =
  createSSEContext();

export const { SSEContext: DashboardSSEContext, SSEProvider: DashboardSSEProvider } =
  createSSEContext();
