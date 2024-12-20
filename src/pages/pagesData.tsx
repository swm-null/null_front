import { routerType } from 'pages/types/router.types';
import { Home } from './home';
import { Login } from './login';
import { Signup } from './signup';
import { FindPw } from './findPw';
import { SSEProviders, ResetProviders } from 'utils';

const pagesData: routerType[] = [
  {
    path: '*',
    element: (
      <SSEProviders>
        <ResetProviders>
          <Home />
        </ResetProviders>
      </SSEProviders>
    ),
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
  {
    path: 'findPw',
    element: <FindPw />,
    title: 'findPw',
  },
];

export default pagesData;
