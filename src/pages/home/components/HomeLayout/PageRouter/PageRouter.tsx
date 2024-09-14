import { Route, Routes } from 'react-router-dom';
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
        path="/main"
        element={
          <Page.MainPage navigateToHistory={() => setCurrentPage('/history')} />
        }
      />
      <Route
        path="/history"
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
    </Routes>
  );
};

export default PageRouter;
