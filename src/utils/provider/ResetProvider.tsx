import { ReactNode, useCallback, useState } from 'react';
import { ResetContext } from 'utils';

const ResetProvider = ({ children }: { children: ReactNode }) => {
  const [eventListeners] = useState<Map<string, Set<() => void>>>(new Map());

  const subscribeToReset = useCallback(
    (key: string, listener: () => void) => {
      if (!eventListeners.has(key)) {
        eventListeners.set(key, new Set());
      }
      eventListeners.get(key)?.add(listener);
    },
    [eventListeners]
  );

  const unsubscribeFromReset = useCallback(
    (key: string, listener: () => void) => {
      eventListeners.get(key)?.delete(listener);
    },
    [eventListeners]
  );

  const onReset = useCallback(
    (key: string) => {
      eventListeners.get(key)?.forEach((listener) => listener());
    },
    [eventListeners]
  );

  return (
    <ResetContext.Provider
      value={{ subscribeToReset, unsubscribeFromReset, onReset }}
    >
      {children}
    </ResetContext.Provider>
  );
};

export default ResetProvider;
