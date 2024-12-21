import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginSignupButton, CustomInput, HiddenInput } from 'pages/components';
import { isLoginResponse, login } from 'api';
import { AlertContext } from 'utils';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { alert } = useContext(AlertContext);

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await login(email, password);
    if (isLoginResponse(response)) {
      Cookies.set('access_token', response.access_token, {});
      Cookies.set('refresh_token', response.refresh_token, {});
      navigate('/');
    } else {
      if (response.exceptionCode === '1003') {
        alert('올바른 형식의 이메일을 입력해 주세요.');
      } else if (
        response.exceptionCode === '1002' ||
        response.exceptionCode === '0001'
      ) {
        alert('이메일, 비밀번호가 맞는지 확인해주세요');
      } else {
        alert('잠시후 다시 시도해주세요.');
      }
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  useEffect(() => {
    const accessToken = Cookies.get('access_token');
    if (accessToken) {
      navigate('/');
    } else {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  if (loading) {
    return <></>;
  }

  return (
    <div
      className="flex flex-col bg-custom-gradient-basic justify-center items-center h-screen 
        py-8 w-full self-center px-6"
    >
      <form
        className="flex flex-col bg-[#FFF6E3CC] w-full max-w-[500px] p-8 shadow-custom rounded-2xl gap-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <CustomInput
            label={t('login.email')}
            value={email}
            setValue={setEmail}
            autoComplete="email"
          />
          <HiddenInput
            label={t('login.password')}
            value={password}
            setValue={setPassword}
          />
          <div className="flex gap-2 text-gray-700 text-sm">
            <p>{t('login.findPw')}</p>
            <p
              className="cursor-pointer underline ml-auto"
              onClick={() => {
                navigate('/findPw');
              }}
            >
              {t('login.findPwButton')}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-col">
          <div className="flex gap-2 flex-col mt-4">
            <LoginSignupButton type="submit" label={t('login.loginButton')} />
          </div>
          <LoginSignupButton
            label={t('login.signupButton')}
            onClick={handleSignup}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
