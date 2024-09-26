import Cookies from 'js-cookie';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginSignUpButton, CustomInput, HiddenInput } from 'pages/components';
import { isLoginResponse, login } from 'utils/auth/user';

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await login(email, password);
    if (isLoginResponse(response)) {
      Cookies.set('access_token', response.access_token, {});
      Cookies.set('refresh_token', response.refresh_token, {});
      navigate('/home');
    } else {
      alert(response.exceptionMessage);
    }
  };

  const handleSignUp = () => {
    navigate('/signUp');
  };

  return (
    <div className="bg-custom-gradient-basic flex justify-center items-center h-screen bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <div className="mb-6">
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

        <LoginSignUpButton
          label={t('login.loginButton')}
          onClick={handleLogin}
          bgColor="#3B82F6"
          hoverColor="#2563EB"
          additionalClasses="mb-4 text-white"
        />

        <LoginSignUpButton
          label={t('login.signUpButton')}
          onClick={handleSignUp}
          bgColor="#E5E7EB"
          hoverColor="#D1D5DB"
        />
      </div>
    </div>
  );
};

export default LoginPage;
