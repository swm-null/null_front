import { ReactNode } from 'react';
import { createSSEContext } from './createSSEContext';

const { SSEContext: CreateSSEContext, SSEProvider: CreateSSEProvider } =
  createSSEContext();

const { SSEContext: SearchSSEContext, SSEProvider: SearchSSEProvider } =
  createSSEContext();

const { SSEContext: DashboardSSEContext, SSEProvider: DashboardSSEProvider } =
  createSSEContext();

const { SSEContext, SSEProvider } = createSSEContext();

const SSEProviders = ({ children }: { children: ReactNode }) => {
  return (
    <SSEProvider>
      <CreateSSEProvider>
        <SearchSSEProvider>
          <DashboardSSEProvider>{children}</DashboardSSEProvider>
        </SearchSSEProvider>
      </CreateSSEProvider>
    </SSEProvider>
  );
};

export {
  SSEContext,
  CreateSSEContext,
  SearchSSEContext,
  DashboardSSEContext,
  SSEProviders,
};
