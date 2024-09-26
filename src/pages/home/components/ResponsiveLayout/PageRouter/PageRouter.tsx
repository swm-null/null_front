import { Navigate, Route, Routes } from 'react-router-dom';
import * as Page from 'pages/home/contents';

const PageRouter = ({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Page.MainPage
            navigateToHistory={() => setCurrentPage('searchHistory')}
          />
        }
      />
      <Route path="/searchHistory" element={<Page.SearchHistoryPage />} />
      <Route path="/dashboard" element={<Page.DashboardPage />} />
      <Route path="/uploadData" element={<Page.UploadDataPage />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default PageRouter;
