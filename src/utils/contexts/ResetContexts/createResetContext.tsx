import { ReactNode, useCallback, useState, createContext } from 'react';

type ResetContextType = {
  subscribeToReset: (listener: () => void) => void;
  unsubscribeFromReset: (listener: () => void) => void;
  subscribeToInvalid: (listener: () => void) => void;
  unsubscribeFromInvalid: (listener: () => void) => void;
  onReset: () => void;
  onInvalid: () => void;
};

export const createResetContext = () => {
  const ResetContext = createContext<ResetContextType>({
    subscribeToReset: () => {},
    unsubscribeFromReset: () => {},
    subscribeToInvalid: () => {},
    unsubscribeFromInvalid: () => {},
    onReset: () => {},
    onInvalid: () => {},
  });

  const ResetProvider = ({ children }: { children: ReactNode }) => {
    const [resetEventListeners] = useState(new Set<() => void>());
    const [invalidEventListeners] = useState(new Set<() => void>());

    const subscribeToReset = useCallback(
      (listener: () => void) => {
        resetEventListeners.add(listener);
      },
      [resetEventListeners]
    );

    const unsubscribeFromReset = useCallback(
      (listener: () => void) => {
        resetEventListeners.delete(listener);
      },
      [resetEventListeners]
    );

    const subscribeToInvalid = useCallback(
      (listener: () => void) => {
        invalidEventListeners.add(listener);
      },
      [invalidEventListeners]
    );

    const unsubscribeFromInvalid = useCallback(
      (listener: () => void) => {
        invalidEventListeners.delete(listener);
      },
      [invalidEventListeners]
    );

    const onReset = useCallback(() => {
      resetEventListeners.forEach((listener) => listener());
    }, [resetEventListeners]);

    const onInvalid = useCallback(() => {
      invalidEventListeners.forEach((listener) => listener());
    }, [invalidEventListeners]);

    return (
      <ResetContext.Provider
        value={{
          onReset,
          onInvalid,
          subscribeToReset,
          unsubscribeFromReset,
          subscribeToInvalid,
          unsubscribeFromInvalid,
        }}
      >
        {children}
      </ResetContext.Provider>
    );
  };

  return { ResetContext, ResetProvider };
};
