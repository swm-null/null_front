import { routerType } from 'pages/types/router.types';
import * as Page from 'pages/home/subPages';
import { ImageListProvider } from 'utils';
import { DashboardModalProvider } from 'utils';

export const getSubPagesData = (
  setCurrentPage: (page: string) => void
): routerType[] => {
  return [
    {
      path: '',
      element: (
        <ImageListProvider>
          <Page.Create />
        </ImageListProvider>
      ),
      title: 'create',
    },
    {
      path: 'search',
      element: (
        <Page.Search navigateToHistory={() => setCurrentPage('searchHistory')} />
      ),
      title: 'search',
    },
    {
      path: 'searchHistory',
      element: <Page.SearchHistory />,
      title: 'searchHistory',
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
