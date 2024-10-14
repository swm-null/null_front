import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Components from 'pages/components';
import { CodeSendForm } from './components';
import { checkEmail, isValidResponse, sendCode, signup } from 'api';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from 'utils';
import { useChangeHandlerManager, useValidationManager } from './hooks';

const Signup = () => {
  const { t } = useTranslation();
  const { alert } = useContext(AlertContext);
  const navigate = useNavigate();

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');

  const changeHandlerManager = useChangeHandlerManager();
  const validationManager = useValidationManager();

  const isValid =
    validationManager.isEmailValid(changeHandlerManager.email) &&
    validationManager.isPasswordValid(changeHandlerManager.password.password) &&
    validationManager.isCodeValid(changeHandlerManager.code) &&
    validationManager.isConfirmPasswordValid(
      changeHandlerManager.password.password,
      changeHandlerManager.password.confirmPassword
    );

  const handleCheckEmail = async () => {
    try {
      const emailString = `${changeHandlerManager.email.emailId}@${changeHandlerManager.email.domain}`;
      const response = await checkEmail(emailString);

      if (isValidResponse(response)) {
        setIsEmailChecked(true);
        setEmailSuccess(t('signup.checkEmailSuccess'));
        validationManager.setEmailError('');
      } else if (Number(response?.exceptionCode) === 1004) {
        setEmailSuccess('');
        validationManager.setEmailError(t('signup.emailAlreadyExists'));
      } else {
        setEmailSuccess('');
        validationManager.setEmailError(t('signup.signupErrorMessage'));
      }
    } catch (error) {
      setEmailSuccess('');
      validationManager.setEmailError(t('signup.signupErrorMessage'));
    }
  };

  const handleSendCode = async () => {
    if (!isEmailChecked) {
      validationManager.setCodeError(t('signup.noCheckEmail'));
      return;
    }

    try {
      const emailString = `${changeHandlerManager.email.emailId}@${changeHandlerManager.email.domain}`;
      const response = await sendCode(emailString);
      if (isValidResponse(response)) {
        setCodeSuccess(t('utils.auth.codeSent'));
      } else {
        validationManager.setCodeError(t('utils.auth.codeSendFailed'));
      }
    } catch {
      validationManager.setCodeError(t('utils.auth.codeSendFailed'));
    }
  };

  const handleSignUp = async () => {
    if (!isValid) return;

    try {
      const response = await signup(
        `${changeHandlerManager.email.emailId}@${changeHandlerManager.email.domain}`,
        changeHandlerManager.password.password,
        changeHandlerManager.password.confirmPassword,
        changeHandlerManager.name,
        changeHandlerManager.code
      );
      if (isValidResponse(response)) {
        alert(t('signup.signupSuccess')).then(() => {
          navigate('/login');
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
          <Components.EmailButtonForm
            email={changeHandlerManager.email}
            buttonText={t('signup.checkEmail')}
            handleEmailChange={(newEmail) => {
              setEmailSuccess('');
              changeHandlerManager.handleEmailChange(newEmail);
              validationManager.validateEmail(newEmail);
            }}
            handleClickButton={handleCheckEmail}
            successMessage={emailSuccess}
            errorMessage={validationManager.error.email}
          />
          <Components.HiddenInput
            label={t('utils.auth.password')}
            value={changeHandlerManager.password.password}
            setValue={(value) => {
              changeHandlerManager.handlePasswordChange(value);
              validationManager.validatePassword(value);
            }}
            errorMessage={validationManager.error.password}
          />
          <Components.HiddenInput
            label={t('utils.auth.confirmPassword')}
            value={changeHandlerManager.password.confirmPassword}
            setValue={(value) => {
              changeHandlerManager.handleConfirmPasswordChange(value);
              validationManager.validateConfirmPassword(
                changeHandlerManager.password.password,
                value
              );
            }}
            errorMessage={validationManager.error.confirmPassword}
          />
          <Components.CustomInput
            label={t('signup.name')}
            value={changeHandlerManager.name}
            setValue={(value) => {
              changeHandlerManager.handleNameChange(value);
              validationManager.validateName(value);
            }}
            errorMessage={validationManager.error.name}
          />
          <CodeSendForm
            code={changeHandlerManager.code}
            handleCodeChange={(newCode) => {
              changeHandlerManager.handleCodeChange(newCode);
              validationManager.validateCode(newCode);
            }}
            handleSendCode={handleSendCode}
            successMessage={codeSuccess}
            errorMessage={validationManager.error.code}
          />
        </div>
        <Components.LoginSignupButton
          label={t('signup.signupButton')}
          onClick={handleSignUp}
          disabled={!isValid}
        />
      </form>
    </div>
  );
};

export default Signup;
