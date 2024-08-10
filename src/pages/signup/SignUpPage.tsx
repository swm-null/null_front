import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthButton, AuthInput } from 'pages/components';
import { useState } from 'react';
import { EmailInput } from './components';

const SignUpPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState({ username: '', domain: '' });
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = () => {
    navigate(-1);
  };

  const handleEmailChange = (newEmail: {
    username: string;
    domain: string;
  }) => {
    setEmail(newEmail);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 py-8">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg overflow-y-auto">
        <div className="mb-6">
          <label
            htmlFor="emailUsername"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {t('signUp.email')}
          </label>
          <EmailInput value={email} onChange={handleEmailChange} />
          <AuthInput
            label={t('signUp.password')}
            value={password}
            setValue={setPassword}
          />
          <AuthInput
            label={t('signUp.passwordConfirm')}
            value={passwordConfirm}
            setValue={setPasswordConfirm}
          />
        </div>
        <div className="mb-6">
          <AuthInput label={t('signUp.name')} value={name} setValue={setName} />
        </div>
        <AuthButton
          label={t('signUp.signUpButton')}
          onClick={handleSignUp}
          bgColor="#3B82F6"
          hoverColor="#2563EB"
          additionalClasses="text-white"
        />
      </form>
    </div>
  );
};

export default SignUpPage;
