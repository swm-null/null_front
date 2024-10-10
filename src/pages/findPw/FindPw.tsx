import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Components from 'pages/components';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from 'utils';
import { isValidResponse, resetPassword, sendCode } from 'api';
import { useValidationManager, useChangeHandlerManager } from './hooks';

const FindPw = () => {
  const { t } = useTranslation();
  const { alert } = useContext(AlertContext);
  const navigate = useNavigate();

  const [emailSuccess, setEmailSuccess] = useState('');

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

  const handleSendCode = async () => {
    try {
      const emailString = `${changeHandlerManager.email.emailId}@${changeHandlerManager.email.domain}`;
      const response = await sendCode(emailString);
      if (isValidResponse(response)) {
        setEmailSuccess(t('signup.codeSent'));
      } else {
        alert(t('signup.codeSendFailed'));
      }
    } catch {
      alert(t('signup.codeSendFailed'));
    }
  };

  const handleFindPassword = async () => {
    if (!isValid) return;

    try {
      const response = await resetPassword(
        `${changeHandlerManager.email.emailId}@${changeHandlerManager.email.domain}`,
        changeHandlerManager.password.password,
        changeHandlerManager.password.confirmPassword,
        changeHandlerManager.code
      );
      if (isValidResponse(response)) {
        alert(t('findPw.findPwSuccess')).then(() => {
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
      <form className="flex flex-col gap-4 bg-[#FFF6E3CC] p-8 rounded-2xl shadow-custom w-full max-w-lg overflow-y-auto">
        <>
          <InfoText />
          <Components.EmailButtonForm
            email={changeHandlerManager.email}
            buttonText={t('findPw.sendCode')}
            handleEmailChange={(newEmail) => {
              setEmailSuccess('');
              changeHandlerManager.handleEmailChange(newEmail);
              validationManager.validateEmail(newEmail);
            }}
            handleClickButton={handleSendCode}
            success={emailSuccess}
            error={validationManager.error.email}
          />
        </>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Components.CustomInput
              label={t('signup.code')}
              value={changeHandlerManager.code}
              setValue={(value) => {
                changeHandlerManager.handleCodeChange(value);
                validationManager.validateCode(value);
              }}
              errorMessage={validationManager.error.code}
            />
            <Components.HiddenInput
              label={t('signup.password')}
              value={changeHandlerManager.password.password}
              setValue={(value) => {
                changeHandlerManager.handlePasswordChange(value);
                validationManager.validatePassword(value);
              }}
              errorMessage={validationManager.error.password}
            />
            <Components.HiddenInput
              label={t('signup.confirmPassword')}
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
          </div>
          <Components.LoginSignupButton
            label={t('findPw.resetPwButton')}
            onClick={handleFindPassword}
            disabled={!isValid}
          />
        </div>
      </form>
    </div>
  );
};

const InfoText = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-bold">{t('findPw.header')}</p>
      <div className="text-sm">
        <p>{t('findPw.instruction')}</p>
        <p>{t('findPw.emailInfo')}</p>
      </div>
    </div>
  );
};

export default FindPw;
