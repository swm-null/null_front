import React, { useState } from 'react';
import { AlertContext } from 'utils/context';
import Alert from './Alert';

type AlertState = {
  message: string;
  onClose: () => void;
};

const AlertDialog = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AlertState | null>(null);

  const alert = (message?: string): Promise<undefined> => {
    return new Promise((resolve) => {
      setState({
        message: message !== undefined ? message : '',
        onClose: () => {
          setState(null);
          resolve(undefined);
        },
      });
    });
  };

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      {state && (
        <Alert message={state.message} onClose={state.onClose} open={!!state} />
      )}
    </AlertContext.Provider>
  );
};

export default AlertDialog;
