import { useContext, useEffect, useState } from 'react';
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
        setEmailSuccess({
          flag: true,
          message: t('signup.checkEmailSuccess'),
        });
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
      setCodeSuccess({
        flag: true,
        message: t('utils.auth.codeSent'),
      });
      const response = await sendCode(emailString);
      if (!isValidResponse(response)) {
        validationManager.setCodeError(t('utils.auth.codeSendFailed'));
      }
    } catch {
      validationManager.setCodeError(t('utils.auth.codeSendFailed'));
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!isValid) return;

    e.preventDefault();

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
        if (response.exceptionCode === '1003') {
          alert('닉네임에는 한글, 영문 및 숫자만 사용할 수 있습니다.');
        } else if (response.exceptionCode === '1004') {
          alert('인증번호가 맞는지 확인해주세요');
        } else {
          alert('잠시후 다시 시도해주세요.');
        }
      }
    } catch {
      alert();
    }
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
      <div className="bg-[#FFF6E3CC] p-8 rounded-2xl shadow-custom w-full max-w-lg overflow-y-auto">
        <div className="flex flex-col gap-3">
          <Components.EmailButtonForm
            email={changeHandlerManager.form.email}
            buttonText={t('signup.checkEmail')}
            handleEmailChange={(newEmail) => {
              setEmailSuccess((prev) => ({ ...prev, flag: false }));
              changeHandlerManager.handleEmailChange(newEmail);
              validationManager.validateEmail(newEmail);
            }}
            handleSubmit={handleCheckEmail}
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
            autoComplete="username"
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
          <form onSubmit={handleSignUp} className="flex flex-col gap-6">
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
            <Components.LoginSignupButton
              label={t('signup.signupButton')}
              disabled={!isValid}
              type="submit"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
