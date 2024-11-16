import { routerType } from 'pages/types';
import { MemoProvider, RecordingProvider } from 'utils';
import * as Page from 'pages/home/subPages';

export const getSubPagesData = (): routerType[] => {
  return [
    {
      path: '',
      element: (
        <RecordingProvider>
          <MemoProvider>
            <Page.Create />
          </MemoProvider>
        </RecordingProvider>
      ),
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
        <RecordingProvider>
          <MemoProvider>
            <Page.Dashboard />
          </MemoProvider>
        </RecordingProvider>
      ),
      title: 'dashboard',
    },
  ];
};
