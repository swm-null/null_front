import { routerType } from 'pages/types/router.types';
import * as Page from 'pages/home/subPages';

export const getSubPagesData = (
  setCurrentPage: (page: string) => void
): routerType[] => {
  return [
    {
      path: '',
      element: (
        <Page.MainPage
          navigateToHistory={() => setCurrentPage('searchHistory')}
        />
      ),
      title: 'main',
    },
    {
      path: 'searchHistory',
      element: <Page.SearchHistoryPage />,
      title: 'searchHistory',
    },
    {
      path: 'dashboard',
      element: <Page.DashboardPage />,
      title: 'dashboard',
    },
    {
      path: 'uploadData',
      element: <Page.UploadDataPage />,
      title: 'uploadData',
    },
  ];
};
