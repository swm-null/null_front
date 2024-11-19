import { createContext } from 'react';

type ResetContextType = {
  subscribeToReset: (listener: () => void) => void;
  unsubscribeFromReset: (listener: () => void) => void;
  onReset: () => void;
};

const ResetContext = createContext<ResetContextType>({
  subscribeToReset: () => {},
  unsubscribeFromReset: () => {},
  onReset: () => {},
});

export default ResetContext;
