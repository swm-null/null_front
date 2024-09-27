import { routerType } from 'pages/types/router.types';
import { Home } from './home';
import Login from './login/Login';
import { Signup } from './signup';

const pagesData: routerType[] = [
  {
    path: '*',
    element: <Home />,
    title: 'home',
  },
  {
    path: 'login',
    element: <Login />,
    title: 'login',
  },
  {
    path: 'signup',
    element: <Signup />,
    title: 'signup',
  },
];

export default pagesData;
