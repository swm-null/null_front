import { routerType } from 'pages/types/router.types';
import * as Page from 'pages/home/subPages';
import { ImageListProvider } from 'utils';

export const getSubPagesData = (
  setCurrentPage: (page: string) => void
): routerType[] => {
  return [
    {
      path: '',
      element: (
        <ImageListProvider>
          <Page.Main
            navigateToHistory={() => setCurrentPage('searchHistory')}
          />
        </ImageListProvider>
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
