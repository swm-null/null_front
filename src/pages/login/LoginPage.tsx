import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginSignUpButton, CustomInput } from 'pages/components';
import SocialLogins from './components/SocialLogins/SocialLogins';
import { isLoginResponse, login } from 'utils/auth/user';

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await login(email, password);
    if (isLoginResponse(response)) {
      navigate('/home');
    } else {
      alert(response.exceptionMessage);
    }
  };

  const handleSignUp = () => {
    navigate('/signUp');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <div className="mb-6">
          <CustomInput
            label={t('login.email')}
            value={email}
            setValue={setEmail}
          />
          <CustomInput
            label={t('login.password')}
            value={password}
            setValue={setPassword}
            hidden
          />
        </div>

        <SocialLogins
          kakaoLabel={t('login.socialLogin.kakao')}
          appleLabel={t('login.socialLogin.apple')}
          googleLabel={t('login.socialLogin.google')}
        />
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
          textColor="gray-700"
        />
      </div>
    </div>
  );
};

export default LoginPage;
