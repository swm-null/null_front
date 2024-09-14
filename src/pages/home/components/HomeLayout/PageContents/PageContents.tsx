import * as Page from 'pages/home/contents';

const PageContents = ({
  useHeaderAnimation,
  isOpen,
  currentPage,
  setCurrentPage,
}: {
  useHeaderAnimation: boolean;
  isOpen: boolean;
  currentPage: string;
  setCurrentPage: (currentPage: string) => void;
}) => {
  const commonProps = {
    headerLeftMarginToggle: useHeaderAnimation ? !isOpen : true,
    headerLeftMargin: 48,
  };

  switch (currentPage) {
    case 'main':
      return (
        <Page.MainPage navigateToHistory={() => setCurrentPage('history')} />
      );
    case 'history':
      return <Page.SearchHistoryPage {...commonProps} />;
    case 'dashboard':
      return <Page.DashboardPage {...commonProps} />;
    case 'uploadData':
      return <Page.UploadDataPage {...commonProps} />;
    default:
      return (
        <Page.MainPage navigateToHistory={() => setCurrentPage('history')} />
      );
  }
};

export default PageContents;
