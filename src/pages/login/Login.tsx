import Cookies from 'js-cookie';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginSignupButton, CustomInput, HiddenInput } from 'pages/components';
import { isLoginResponse, login } from 'api';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await login(email, password);
    if (isLoginResponse(response)) {
      Cookies.set('access_token', response.access_token, {});
      Cookies.set('refresh_token', response.refresh_token, {});
      navigate('/');
    } else {
      alert(response.exceptionMessage);
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="bg-custom-gradient-basic flex justify-center items-center h-screen py-8">
      <div className="flex flex-col bg-[#FFF6E3CC] p-8 shadow-custom w-full max-w-lg rounded-2xl gap-6">
        <div className="flex flex-col gap-2">
          <CustomInput
            label={t('login.email')}
            value={email}
            setValue={setEmail}
          />
          <HiddenInput
            label={t('login.password')}
            value={password}
            setValue={setPassword}
          />
        </div>

        <div className="flex gap-2 flex-col">
          <LoginSignupButton
            label={t('login.loginButton')}
            onClick={handleLogin}
          />
          <LoginSignupButton
            label={t('login.signupButton')}
            onClick={handleSignup}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
