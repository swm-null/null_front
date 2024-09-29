import { routerType } from 'pages/types/router.types';
import * as Page from 'pages/home/subPages';

export const getSubPagesData = (
  setCurrentPage: (page: string) => void
): routerType[] => {
  return [
    {
      path: '',
      element: (
        <Page.Main navigateToHistory={() => setCurrentPage('searchHistory')} />
      ),
      title: 'main',
    },
    {
      path: 'searchHistory',
      element: <Page.SearchHistory />,
      title: 'searchHistory',
    },
    {
      path: 'dashboard',
      element: <Page.Dashboard />,
      title: 'dashboard',
    },
    {
      path: 'uploadData',
      element: <Page.UploadData />,
      title: 'uploadData',
    },
  ];
};
