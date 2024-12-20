import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Components from 'pages/components';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from 'utils';
import { isValidResponse } from 'pages/api';
import { useChangeHandlerManager } from './hooks';
import { useValidationManager } from 'pages/hooks';
import { requestVerificationCode } from 'pages/api';
import { resetPassword } from './api';

const FindPw = () => {
  const { t } = useTranslation();
  const { alert } = useContext(AlertContext);
  const navigate = useNavigate();

  const [emailSuccess, setEmailSuccess] = useState({
    flag: false,
    message: '',
  });

  const changeHandlerManager = useChangeHandlerManager();
  const validationManager = useValidationManager();

  const isValid = validationManager.isValid(changeHandlerManager.form);

  const handleSendCode = async () => {
    try {
      const emailString = `${changeHandlerManager.form.email.emailId}@${changeHandlerManager.form.email.domain}`;
      setEmailSuccess({ flag: true, message: t('utils.auth.codeSent') });

      const response = await requestVerificationCode(emailString);
      if (!isValidResponse(response)) {
        alert(t('utils.auth.codeSendFailed'));
      }
    } catch {
      alert(t('utils.auth.codeSendFailed'));
    }
  };

  const handleFindPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!isValid) return;

    e.preventDefault();

    try {
      const response = await resetPassword(
        `${changeHandlerManager.form.email.emailId}@${changeHandlerManager.form.email.domain}`,
        changeHandlerManager.form.password,
        changeHandlerManager.form.confirmPassword,
        changeHandlerManager.form.code
      );
      if (isValidResponse(response)) {
        alert(t('findPw.findPwSuccess')).then(() => {
          navigate('/login');
        });
      } else {
        alert(response.exceptionMessage);
      }
    } catch {}
  };

  useEffect(() => {
    changeHandlerManager.form.confirmPassword &&
      validationManager.validateConfirmPassword(
        changeHandlerManager.form.password,
        changeHandlerManager.form.confirmPassword
      );
  }, [changeHandlerManager.form.password]);

  return (
    <div className="bg-custom-gradient-basic flex justify-center items-center h-screen py-8">
      <div className="flex flex-col gap-4 bg-[#FFF6E3CC] p-8 rounded-2xl shadow-custom w-full max-w-lg overflow-y-auto">
        <>
          <InfoText />
          <Components.EmailButtonForm
            email={changeHandlerManager.form.email}
            buttonText={t('findPw.sendCode')}
            handleEmailChange={(newEmail) => {
              setEmailSuccess((prev) => ({ ...prev, flag: false }));
              changeHandlerManager.handleEmailChange(newEmail);
              validationManager.validateEmail(newEmail);
            }}
            handleSubmit={handleSendCode}
            success={emailSuccess}
            error={validationManager.error.email}
          />
        </>

        <form className="flex flex-col gap-5" onSubmit={handleFindPassword}>
          <div className="flex flex-col gap-2">
            <Components.CustomInput
              label={t('utils.auth.code')}
              value={changeHandlerManager.form.code}
              setValue={(value) => {
                changeHandlerManager.handleCodeChange(value);
                validationManager.validateCode(value);
              }}
              error={validationManager.error.code}
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
            type="submit"
            label={t('findPw.resetPwButton')}
            disabled={!isValid}
          />
        </form>
      </div>
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
