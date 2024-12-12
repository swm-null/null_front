import { ReactNode } from 'react';
import { createResetContext } from './createResetContext';

const { ResetContext: CreateResetContext, ResetProvider: CreateResetProvider } =
  createResetContext();

const { ResetContext: SearchResetContext, ResetProvider: SearchResetProvider } =
  createResetContext();

const {
  ResetContext: DashboardResetContext,
  ResetProvider: DashboardResetProvider,
} = createResetContext();

const ResetProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <CreateResetProvider>
      <SearchResetProvider>
        <DashboardResetProvider>{children}</DashboardResetProvider>
      </SearchResetProvider>
    </CreateResetProvider>
  );
};

export {
  CreateResetContext,
  SearchResetContext,
  DashboardResetContext,
  ResetProviders,
};
