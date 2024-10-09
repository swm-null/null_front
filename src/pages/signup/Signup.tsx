import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LoginSignupButton,
  HiddenInput,
  CustomInput,
  EmailButtonForm,
} from 'pages/components';
import { CodeSendForm } from './components';
import * as Hooks from './hooks';
import { isValidResponse, signup } from 'api';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from 'utils';

const Signup = () => {
  const { t } = useTranslation();
  const { alert } = useContext(AlertContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [isSignupButtonDisabled, setIsSignupButtonDisabled] = useState(true);

  const emailManager = Hooks.useEmailManager();
  const passwordManager = Hooks.usePasswordManager();
  const codeManager = Hooks.useCodeManager(
    emailManager.isEmailChecked,
    emailManager.email
  );
  const { isValid } = Hooks.useValidationManager({
    email: emailManager.email,
    password: passwordManager.password,
    confirmPassword: passwordManager.confirmPassword,
    name: name,
    code: codeManager.code,
  });

  const handleEmailChange = (newEmail: { emailId: string; domain: string }) => {
    emailManager.handleEmailChange(newEmail);
  };

  const handlePasswordChange = (newPassword: string) => {
    passwordManager.handlePasswordChange(newPassword);
  };

  const handleConfirmPasswordChange = (newConfirmPassword: string) => {
    passwordManager.handleConfirmPasswordChange(newConfirmPassword);
  };

  const handleCodeChange = (newCode: string) => {
    codeManager.handleCodeChange(newCode);
  };

  useEffect(() => {
    const essentialApiSent =
      emailManager.isEmailChecked && codeManager.isCodeSent;
    setIsSignupButtonDisabled(!isValid || !essentialApiSent);
  }, [
    emailManager.email,
    passwordManager.password,
    passwordManager.confirmPassword,
    codeManager.code,
  ]);

  const handleSignUp = async () => {
    if (isSignupButtonDisabled) {
      return;
    }

    try {
      const response = await signup(
        `${emailManager.email.emailId}@${emailManager.email.domain}`,
        passwordManager.password,
        passwordManager.confirmPassword,
        name,
        codeManager.code
      );
      if (isValidResponse(response)) {
        alert(t('signup.signupSuccess')).then(() => {
          navigate(-1);
        });
      } else {
        alert(response.exceptionMessage);
      }
    } catch {
      alert();
    }
  };

  return (
    <div className="bg-custom-gradient-basic flex justify-center items-center h-screen py-8">
      <form className="bg-[#FFF6E3CC] p-8 rounded-2xl shadow-custom w-full max-w-lg overflow-y-auto">
        <div className="flex flex-col mb-6 gap-3">
          <EmailButtonForm
            email={emailManager.email}
            buttonText={t('signup.checkEmail')}
            handleEmailChange={handleEmailChange}
            handleClickButton={emailManager.handleCheckEmail}
            success={emailManager.success}
            error={emailManager.error}
          />
          <HiddenInput
            label={t('signup.password')}
            value={passwordManager.password}
            setValue={handlePasswordChange}
            errorMessage={passwordManager.passwordError}
          />
          <HiddenInput
            label={t('signup.confirmPassword')}
            value={passwordManager.confirmPassword}
            setValue={handleConfirmPasswordChange}
            errorMessage={passwordManager.confirmPasswordError}
          />
          <CustomInput
            label={t('signup.name')}
            value={name}
            setValue={setName}
          />
          <CodeSendForm
            code={codeManager.code}
            handleCodeChange={handleCodeChange}
            handleSendCode={codeManager.handleSendCode}
            success={codeManager.success}
            error={codeManager.error}
          />
        </div>
        <LoginSignupButton
          label={t('signup.signupButton')}
          onClick={handleSignUp}
          disabled={isSignupButtonDisabled}
        />
      </form>
    </div>
  );
};

export default Signup;
