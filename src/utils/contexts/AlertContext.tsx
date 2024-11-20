import { createContext } from 'react';
import { useState, useEffect, useCallback, ReactNode } from 'react';

type AlertState = {
  message: string;
  onConfirm: () => void;
  onClose?: () => void;
};

type Type = {
  alert: (message?: string) => Promise<undefined>;
  confirmAlert: (message?: string) => Promise<boolean>;
  alertState: AlertState | null;
};

export const AlertContext = createContext<Type>({
  alert: () => new Promise((_, reject) => reject()),
  confirmAlert: () => new Promise((_, reject) => reject()),
  alertState: null,
});

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertState, setAlertState] = useState<AlertState | null>(null);

  const alert = (message?: string): Promise<undefined> =>
    new Promise((resolve) => {
      setAlertState({
        message: message || '',
        onConfirm: () => {
          setAlertState(null);
          resolve(undefined);
        },
      });
    });

  const confirmAlert = (message?: string): Promise<boolean> =>
    new Promise((resolve) => {
      setAlertState({
        message: message || '',

        onConfirm: () => {
          setAlertState(null);
          resolve(true);
        },
        onClose: () => {
          setAlertState(null);
          resolve(false);
        },
      });
    });

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && alertState) {
        alertState.onConfirm();
      }
    },
    [alertState]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape]);

  return (
    <AlertContext.Provider value={{ alert, confirmAlert, alertState }}>
      {children}
    </AlertContext.Provider>
  );
};
