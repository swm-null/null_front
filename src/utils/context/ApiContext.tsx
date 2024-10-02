import { createContext } from 'react';

type ApiContextType = {
  authApi: any;
  refreshableApi: any;
};

const ApiContext = createContext<ApiContextType>({
  authApi: null,
  refreshableApi: null,
});

export default ApiContext;
