import { routerType } from 'pages/types/router.types';
import * as Page from 'pages/home/subPages';
import { MemoProvider, TagProvider } from 'utils';

export const getSubPagesData = (): routerType[] => {
  return [
    {
      path: '',
      element: <Page.Create />,
      title: 'create',
    },
    {
      path: 'search',
      element: (
        <MemoProvider>
          <Page.Search />
        </MemoProvider>
      ),
      title: 'search',
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
