import { routerType } from 'pages/types/router.types';
import * as Page from 'pages/home/subPages';
import { MemoProvider } from 'utils';
import { RecordingProvider } from 'utils';

export const getSubPagesData = (): routerType[] => {
  return [
    {
      path: '',
      element: (
        <RecordingProvider>
          <Page.Create />
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
    {
      path: 'uploadData',
      element: <Page.UploadData />,
      title: 'uploadData',
    },
  ];
};
