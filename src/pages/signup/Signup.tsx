import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Components from 'pages/components';
import { CodeSendForm } from './components';
import { checkEmail, isValidResponse, sendCode, signup } from 'api';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from 'utils';
import { useChangeHandlerManager } from './hooks';
import { useValidationManager } from 'pages/hooks';

const Signup = () => {
  const { t } = useTranslation();
  const { alert } = useContext(AlertContext);
  const navigate = useNavigate();

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState({
    flag: false,
    message: '',
  });
  const [codeSuccess, setCodeSuccess] = useState({
    flag: false,
    message: '',
  });

  const changeHandlerManager = useChangeHandlerManager();
  const validationManager = useValidationManager();

  const isValid = validationManager.isValid(changeHandlerManager.form);

  const handleCheckEmail = async () => {
    try {
      const emailString = `${changeHandlerManager.form.email.emailId}@${changeHandlerManager.form.email.domain}`;
      const response = await checkEmail(emailString);

      if (isValidResponse(response)) {
        setIsEmailChecked(true);
        setEmailSuccess((prev) => ({
          ...prev,
          message: t('signup.checkEmailSuccess'),
        }));
        validationManager.setEmailError('');
      } else if (Number(response?.exceptionCode) === 1004) {
        setEmailSuccess((prev) => ({ ...prev, flag: false }));
        validationManager.setEmailError(t('signup.emailAlreadyExists'));
      } else {
        setEmailSuccess((prev) => ({ ...prev, flag: false }));
        validationManager.setEmailError(t('signup.signupErrorMessage'));
      }
    } catch (error) {
      setEmailSuccess((prev) => ({ ...prev, flag: false }));
      validationManager.setEmailError(t('signup.signupErrorMessage'));
    }
  };

  const handleSendCode = async () => {
    if (!isEmailChecked) {
      validationManager.setCodeError(t('signup.noCheckEmail'));
      return;
    }

    try {
      const emailString = `${changeHandlerManager.form.email.emailId}@${changeHandlerManager.form.email.domain}`;
      const response = await sendCode(emailString);
      if (isValidResponse(response)) {
        setCodeSuccess({
          flag: true,
          message: t('utils.auth.codeSent'),
        });
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
        `${changeHandlerManager.form.email.emailId}@${changeHandlerManager.form.email.domain}`,
        changeHandlerManager.form.password,
        changeHandlerManager.form.confirmPassword,
        changeHandlerManager.form.name,
        changeHandlerManager.form.code
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
            email={changeHandlerManager.form.email}
            buttonText={t('signup.checkEmail')}
            handleEmailChange={(newEmail) => {
              setEmailSuccess((prev) => ({ ...prev, flag: false }));
              changeHandlerManager.handleEmailChange(newEmail);
              validationManager.validateEmail(newEmail);
            }}
            handleClickButton={handleCheckEmail}
            success={emailSuccess}
            error={validationManager.error.email}
          />
          <CodeSendForm
            code={changeHandlerManager.form.code}
            handleCodeChange={(newCode) => {
              changeHandlerManager.handleCodeChange(newCode);
              validationManager.validateCode(newCode);
            }}
            handleSendCode={handleSendCode}
            success={codeSuccess}
            error={validationManager.error.code}
          />
          <Components.CustomInput
            label={t('signup.name')}
            value={changeHandlerManager.form.name}
            setValue={(value) => {
              changeHandlerManager.handleNameChange(value);
              validationManager.validateName(value);
            }}
            error={validationManager.error.name}
          />
          <Components.HiddenInput
            label={t('utils.auth.password')}
            value={changeHandlerManager.form.password}
            setValue={(value) => {
              changeHandlerManager.handlePasswordChange(value);
              validationManager.validatePassword(value);
            }}
            error={validationManager.error.password}
          />
          <Components.HiddenInput
            label={t('utils.auth.confirmPassword')}
            value={changeHandlerManager.form.confirmPassword}
            setValue={(value) => {
              changeHandlerManager.handleConfirmPasswordChange(value);
              validationManager.validateConfirmPassword(
                changeHandlerManager.form.password,
                value
              );
            }}
            error={validationManager.error.confirmPassword}
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
