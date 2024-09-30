import { createContext } from 'react';

type AlertState = {
  message: string;
  onClose: () => void;
};

type Type = {
  alert: (message?: string) => Promise<undefined>;
  alertState: AlertState | null; // alertState 추가
};

const AlertContext = createContext<Type>({
  alert: () => new Promise((_, reject) => reject()),
  alertState: null, // 기본값
});

export default AlertContext;
