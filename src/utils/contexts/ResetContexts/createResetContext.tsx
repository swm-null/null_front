import { ReactNode, useCallback, useState, createContext } from 'react';

type ResetContextType = {
  subscribeToReset: (listener: () => void) => void;
  unsubscribeFromReset: (listener: () => void) => void;
  onReset: () => void;
};

export const createResetContext = () => {
  const ResetContext = createContext<ResetContextType>({
    subscribeToReset: () => {},
    unsubscribeFromReset: () => {},
    onReset: () => {},
  });

  const ResetProvider = ({ children }: { children: ReactNode }) => {
    const [eventListeners] = useState(new Set<() => void>());

    const subscribeToReset = useCallback(
      (listener: () => void) => {
        eventListeners.add(listener);
      },
      [eventListeners]
    );

    const unsubscribeFromReset = useCallback(
      (listener: () => void) => {
        eventListeners.delete(listener);
      },
      [eventListeners]
    );

    const onReset = useCallback(() => {
      eventListeners.forEach((listener) => listener());
    }, [eventListeners]);

    return (
      <ResetContext.Provider
        value={{ onReset, subscribeToReset, unsubscribeFromReset }}
      >
        {children}
      </ResetContext.Provider>
    );
  };

  return { ResetContext, ResetProvider };
};
