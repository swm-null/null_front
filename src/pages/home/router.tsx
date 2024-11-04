import { Route, Routes } from 'react-router-dom';
import { getSubPagesData } from './subPagesData';
import { routerType } from 'pages/types';

export const HomeRouter = () => {
  const subPageRoutes = getSubPagesData().map(
    ({ path, title, element }: routerType) => {
      return <Route key={title} path={`/${path}`} element={element} />;
    }
  );

  return <Routes>{subPageRoutes}</Routes>;
};
