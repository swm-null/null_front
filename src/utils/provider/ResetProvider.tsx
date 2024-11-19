import { ReactNode, useCallback, useState } from 'react';
import { ResetContext } from 'utils/context';

const createResetContext = () => {
  const Context = ResetContext;

  const Provider = ({ children }: { children: ReactNode }) => {
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
      <Context.Provider value={{ onReset, subscribeToReset, unsubscribeFromReset }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};

export const { Context: CreateResetContext, Provider: CreateResetProvider } =
  createResetContext();
export const { Context: SearchResetContext, Provider: SearchResetProvider } =
  createResetContext();
export const { Context: DashboardResetContext, Provider: DashboardResetProvider } =
  createResetContext();
