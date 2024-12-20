import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useValidationManager = () => {
  const { t } = useTranslation();
  const [error, setError] = useState({
    email: { flag: false, message: '' },
    password: { flag: false, message: '' },
    confirmPassword: { flag: false, message: '' },
    name: { flag: false, message: '' },
    code: { flag: false, message: '' },
  });

  const isEmailValid = (email: { emailId: string; domain: string }) => {
    const emailIdRegex = /^[a-zA-Z0-9._%+-]+$/;
    const emailDomainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailIdRegex.test(email.emailId) && emailDomainRegex.test(email.domain);
  };

  const isPasswordValid = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const isConfirmPasswordValid = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

  const isNameValid = (name: string) => {
    const nameRegex = /^(?!\s*$).+/;
    return nameRegex.test(name);
  };

  const isCodeValid = (code: string) => {
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
  };

  const validateEmail = (email: { emailId: string; domain: string }) => {
    if (!isEmailValid(email)) {
      setError((prev) => ({
        ...prev,
        email: {
          flag: true,
          message: t('signup.invalidEmail'),
        },
      }));
    } else {
      setError((prev) => ({ ...prev, email: { ...prev.email, flag: false } }));
    }
  };

  const validatePassword = (password: string) => {
    if (!isPasswordValid(password)) {
      setError((prev) => ({
        ...prev,
        password: {
          flag: true,
          message: t('signup.invalidPassword'),
        },
      }));
    } else {
      setError((prev) => ({
        ...prev,
        password: { ...prev.password, flag: false },
      }));
    }
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!isConfirmPasswordValid(password, confirmPassword)) {
      setError((prev) => ({
        ...prev,
        confirmPassword: {
          flag: true,
          message: t('signup.passwordsDoNotMatch'),
        },
      }));
    } else {
      setError((prev) => ({
        ...prev,
        confirmPassword: { ...prev.confirmPassword, flag: false },
      }));
    }
  };

  const validateName = (name: string) => {
    if (!isNameValid(name)) {
      setError((prev) => ({
        ...prev,
        name: {
          flag: true,
          message: t('signup.invalidName'),
        },
      }));
      return t('signup.invalidName');
    } else {
      setError((prev) => ({ ...prev, name: { ...prev.name, flag: false } }));
    }
  };

  const validateCode = (code: string) => {
    if (!isCodeValid(code)) {
      setError((prev) => ({
        ...prev,
        code: {
          flag: true,
          message: t('signup.invalidCodeForm'),
        },
      }));
    } else {
      setError((prev) => ({ ...prev, code: { ...prev.code, flag: false } }));
    }
  };

  const isValid = ({
    email,
    password,
    confirmPassword,
    name,
    code,
  }: {
    email: { emailId: string; domain: string };
    password: string;
    confirmPassword: string;
    name?: string;
    code: string;
  }) =>
    isEmailValid(email) &&
    isPasswordValid(password) &&
    isCodeValid(code) &&
    (name ? isNameValid(name) : true) &&
    isConfirmPasswordValid(password, confirmPassword);

  const setEmailError = (message: string) => {
    setError((prev) => ({ ...prev, email: { flag: true, message } }));
  };

  const setCodeError = (message: string) => {
    setError((prev) => ({ ...prev, code: { flag: true, message } }));
  };

  return {
    error,
    setEmailError,
    setCodeError,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateName,
    validateCode,
    isValid,
  };
};

export default useValidationManager;
