import { Route, Routes } from 'react-router-dom';
import { getSubPagesData } from './subPagesData';
import { routerType } from 'pages/types';

export const HomeRouter = ({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) => {
  const subPageRoutes = getSubPagesData(setCurrentPage).map(
    ({ path, title, element }: routerType) => {
      return <Route key={title} path={`/${path}`} element={element} />;
    }
  );

  return <Routes>{subPageRoutes}</Routes>;
};
