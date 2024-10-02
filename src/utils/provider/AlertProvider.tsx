import { useState, useEffect, useCallback, ReactNode } from 'react';
import { AlertContext } from 'utils/context';

type AlertState = {
  message: string;
  onClose: () => void;
};

const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertState, setAlertState] = useState<AlertState | null>(null);

  const alert = (message?: string): Promise<undefined> =>
    new Promise((resolve) => {
      setAlertState({
        message: message || '',
        onClose: () => {
          setAlertState(null);
          resolve(undefined);
        },
      });
    });

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && alertState) {
        alertState.onClose();
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
    <AlertContext.Provider value={{ alert, alertState }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
