import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SocialLoginButton } from './components';
import { useState } from 'react';
import { AuthButton, AuthInput } from 'pages/components';

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: 로그인 로직 추가
    navigate('/home');
  };

  const handleSignUp = () => {
    navigate('/signUp');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <div className="mb-6">
          <AuthInput
            label={t('login.email')}
            value={email}
            setValue={setEmail}
          />
          <AuthInput
            label={t('login.password')}
            value={password}
            setValue={setPassword}
            hidden
          />
        </div>

        <div className="flex justify-between mb-2 gap-2">
          <SocialLoginButton
            label={t('login.socialLogin.kakao')}
            backgroundColor="#FEE500"
            hoverColor="#FFD700"
            textColor="black"
          />
          <SocialLoginButton
            label={t('login.socialLogin.apple')}
            backgroundColor="#000000"
            hoverColor="#333333"
            textColor="white"
          />
          <SocialLoginButton
            label={t('login.socialLogin.google')}
            backgroundColor="#FFFFFF"
            hoverColor="#F5F5F5"
            textColor="black"
            borderColor="border-gray-300"
          />
        </div>
        <AuthButton
          label={t('login.loginButton')}
          onClick={handleLogin}
          bgColor="#3B82F6"
          hoverColor="#2563EB"
          additionalClasses="mb-4 text-white"
        />
        <AuthButton
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
