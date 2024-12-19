import Cookies from 'js-cookie';

const saveToken = (access_token: string, refresh_token: string) => {
  Cookies.set('access_token', access_token, {});
  Cookies.set('refresh_token', refresh_token, {});
};

export default saveToken;
