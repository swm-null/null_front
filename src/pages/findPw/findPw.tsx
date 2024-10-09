import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginSignupButton, HiddenInput, CustomInput } from 'pages/components';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from 'utils';
import { EmailCheckForm } from 'pages/signup/components';

const Signup = () => {
  const { t } = useTranslation();
  const { alert } = useContext(AlertContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState<{ emailId: string; domain: string }>({
    emailId: '',
    domain: '',
  });
  const [resetPassword, setResetPassword] = useState({
    password: '',
    confirmPassword: '',
  });
  const [code, setCode] = useState('');
  const [success, setSucces] = useState('');
  const [error, setError] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
  });

  const isEmailValid =
    /^[a-zA-Z0-9._%+-]+$/.test(email.emailId) &&
    /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.domain);
  const isPasswordValid =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
      resetPassword.password
    );
  const isConfirmPasswordValid =
    resetPassword.password === resetPassword.confirmPassword;
  const isCodeValid = /^\d{6}$/.test(code);

  const isValid =
    isEmailValid && isPasswordValid && isConfirmPasswordValid && isCodeValid;

  const handleEmailChange = (newEmail: { emailId: string; domain: string }) => {
    setEmail(newEmail);
  };

  const handlePasswordChange = (value: string) => {
    if (isPasswordValid) {
    }
    setResetPassword((prev) => ({
      ...prev,
      password: value,
    }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setResetPassword((prev) => ({
      ...prev,
      confirmPassword: value,
    }));
  };

  const handleCodeChange = (code: string) => {
    setCode(code);
  };

  const handleSendCode = () => {};

  return (
    <div className="bg-custom-gradient-basic flex justify-center items-center h-screen py-8">
      <form className="flex flex-col gap-4 bg-[#FFF6E3CC] p-8 rounded-2xl shadow-custom w-full max-w-lg overflow-y-auto">
        <>
          <div className="flex flex-col gap-4">
            <p className="text-lg font-bold">{t('findPw.header')}</p>
            <div>
              <p>{t('findPw.instruction')}</p>
              <p>{t('findPw.emailInfo')}</p>
            </div>
          </div>
          <EmailCheckForm
            email={email}
            handleEmailChange={handleEmailChange}
            handleCheckEmail={handleSendCode}
            success={success}
            error={error.email}
          />
        </>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <CustomInput
              label={t('signup.code')}
              value={code}
              setValue={handleCodeChange}
              errorMessage={error.code}
            />
            <HiddenInput
              label={t('signup.password')}
              value={resetPassword.password}
              setValue={handlePasswordChange}
              errorMessage={error.password}
            />
            <HiddenInput
              label={t('signup.confirmPassword')}
              value={resetPassword.confirmPassword}
              setValue={handleConfirmPasswordChange}
              errorMessage={error.confirmPassword}
            />
          </div>
          <LoginSignupButton
            label={t('findPw.resetPwButton')}
            onClick={() => {}}
            disabled={!isValid}
          />
        </div>
      </form>
    </div>
  );
};

export default Signup;
