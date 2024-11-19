import { ReactNode, useEffect, useState, createContext } from 'react';

type SSEContextType = {
  connect: (url: string, onReset: () => void) => void;
  disconnect: () => void;
  isConnected: boolean;
};

export const createSSEContext = () => {
  const SSEContext = createContext<SSEContextType>({
    connect: () => {},
    disconnect: () => {},
    isConnected: false,
  });

  const SSEProvider = ({ children }: { children: ReactNode }) => {
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
