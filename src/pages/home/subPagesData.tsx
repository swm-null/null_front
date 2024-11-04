import { routerType } from 'pages/types/router.types';
import * as Page from 'pages/home/subPages';
import { MemoProvider, TagProvider } from 'utils';

export const getSubPagesData = (
  setCurrentPage: (page: string) => void
): routerType[] => {
  return [
    {
      path: '',
      element: <Page.Create />,
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
        <MemoProvider>
          <TagProvider>
            <Page.Dashboard />
          </TagProvider>
        </MemoProvider>
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
