import { createContext } from 'react';

interface SSEContextType {
  connect: (url: string, onReset: () => void) => void;
  disconnect: () => void;
  isConnected: boolean;
}

const SSEContext = createContext<SSEContextType>({
  connect: () => {},
  disconnect: () => {},
  isConnected: false,
});

export default SSEContext;
