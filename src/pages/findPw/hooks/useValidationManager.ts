import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useValidation = () => {
  const { t } = useTranslation();
  const [error, setError] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
  });

  const isEmailValid = (email: { emailId: string; domain: string }) => {
    const emailIdRegex = /^[a-zA-Z0-9._%+-]+$/;
    const emailDomainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return (
      emailIdRegex.test(email.emailId) && emailDomainRegex.test(email.domain)
    );
  };

  const isPasswordValid = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const isConfirmPasswordValid = (
    password: string,
    confirmPassword: string
  ) => {
    return password === confirmPassword;
  };

  const isCodeValid = (code: string) => {
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
  };

  const validateEmail = (email: { emailId: string; domain: string }) => {
    if (!isEmailValid(email)) {
      setError((prev) => ({ ...prev, email: t('signup.invalidEmail') }));
    } else {
      setError((prev) => ({ ...prev, email: '' }));
    }
  };

  const validatePassword = (password: string) => {
    if (!isPasswordValid(password)) {
      setError((prev) => ({ ...prev, password: t('signup.invalidPassword') }));
    } else {
      setError((prev) => ({ ...prev, password: '' }));
    }
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    if (!isConfirmPasswordValid(password, confirmPassword)) {
      setError((prev) => ({
        ...prev,
        confirmPassword: t('signup.passwordsDoNotMatch'),
      }));
    } else {
      setError((prev) => ({
        ...prev,
        confirmPassword: '',
      }));
    }
  };

  const validateCode = (code: string) => {
    if (!isCodeValid(code)) {
      setError((prev) => ({ ...prev, code: t('signup.invalidCodeForm') }));
    } else {
      setError((prev) => ({ ...prev, code: '' }));
    }
  };

  const isValid = ({
    email,
    password,
    confirmPassword,
    code,
  }: {
    email: { emailId: string; domain: string };
    password: string;
    confirmPassword: string;
    code: string;
  }) =>
    isEmailValid(email) &&
    isPasswordValid(password) &&
    isCodeValid(code) &&
    isConfirmPasswordValid(password, confirmPassword);

  return {
    error,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateCode,
    isValid,
  };
};

export default useValidation;
