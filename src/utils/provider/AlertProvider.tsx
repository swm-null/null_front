import { useState, useEffect, useCallback, ReactNode } from 'react';
import { AlertContext } from 'utils/context';

type AlertState = {
  message: string;
  onConfirm: () => void;
  onClose?: () => void;
};

const AlertProvider = ({ children }: { children: ReactNode }) => {
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

export default AlertProvider;
