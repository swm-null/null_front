import { Navigate, Route, Routes } from 'react-router-dom';
import * as Page from 'pages/home/contents';

const PageRouter = ({
  useHeaderAnimation,
  isOpen,
  setCurrentPage,
}: {
  useHeaderAnimation: boolean;
  isOpen: boolean;
  setCurrentPage: (page: string) => void;
}) => {
  const commonProps = {
    headerLeftMarginToggle: useHeaderAnimation ? !isOpen : true,
    headerLeftMargin: 48,
  };

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
      <Route
        path="/searchHistory"
        element={<Page.SearchHistoryPage {...commonProps} />}
      />
      <Route
        path="/dashboard"
        element={<Page.DashboardPage {...commonProps} />}
      />
      <Route
        path="/uploadData"
        element={<Page.UploadDataPage {...commonProps} />}
      />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default PageRouter;