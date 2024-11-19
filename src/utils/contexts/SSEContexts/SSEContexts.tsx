import { ReactNode } from 'react';
import { createSSEContext } from './createSSEContext';

const { SSEContext: CreateSSEContext, SSEProvider: CreateSSEProvider } =
  createSSEContext();

const { SSEContext: SearchSSEContext, SSEProvider: SearchSSEProvider } =
  createSSEContext();

const { SSEContext: DashboardSSEContext, SSEProvider: DashboardSSEProvider } =
  createSSEContext();

const SSEProviders = ({ children }: { children: ReactNode }) => {
  return (
    <CreateSSEProvider>
      <SearchSSEProvider>
        <DashboardSSEProvider>{children}</DashboardSSEProvider>
      </SearchSSEProvider>
    </CreateSSEProvider>
  );
};

export { CreateSSEContext, SearchSSEContext, DashboardSSEContext, SSEProviders };
