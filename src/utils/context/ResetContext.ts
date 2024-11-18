import { createContext } from 'react';

type ResetContextType = {
  subscribeToReset: (key: string, listener: () => void) => void;
  unsubscribeFromReset: (key: string, listener: () => void) => void;
  onReset: (key: string) => void;
};

const ResetContext = createContext<ResetContextType>({
  subscribeToReset: () => {},
  unsubscribeFromReset: () => {},
  onReset: () => {},
});

export default ResetContext;
