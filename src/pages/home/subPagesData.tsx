import { routerType } from 'pages/types/router.types';
import * as Page from 'pages/home/subPages';
import { DashboardModalProvider } from 'utils';

export const getSubPagesData = (): routerType[] => {
  return [
    {
      path: '',
      element: <Page.Create />,
      title: 'create',
    },
    {
      path: 'search',
      element: <Page.Search />,
      title: 'search',
    },
    {
      path: 'dashboard',
      element: (
        <DashboardModalProvider>
          <Page.Dashboard />
        </DashboardModalProvider>
      ),
      title: 'dashboard',
    },
    {
      path: 'uploadData',
      element: <Page.UploadData />,
      title: 'uploadData',
    },
  ];
};
