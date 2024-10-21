import { createContext } from 'react';

type ApiContextType = {
  authApi: any;
  refreshableApi: any;
  checkTokenFromCookie: () => void;
};

const ApiContext = createContext<ApiContextType>({
  authApi: null,
  refreshableApi: null,
  checkTokenFromCookie: () => {},
});

export default ApiContext;
