import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const usePasswordManager = () => {
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    return password === confirmPassword;
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    if (!validatePassword(newPassword)) {
      setPasswordError(t('signup.invalidPassword'));
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (newConfirmPassword: string) => {
    setConfirmPassword(newConfirmPassword);
    if (!validateConfirmPassword(newConfirmPassword)) {
      setConfirmPasswordError(t('signup.passwordsDoNotMatch'));
    } else {
      setConfirmPasswordError('');
    }
  };

  return {
    password,
    confirmPassword,
    passwordError,
    confirmPasswordError,
    handlePasswordChange,
    handleConfirmPasswordChange,
  };
};

export default usePasswordManager;
