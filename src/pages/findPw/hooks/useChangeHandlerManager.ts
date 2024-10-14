import { useState } from 'react';

const useChangeHandler = () => {
  const [email, setEmail] = useState<{ emailId: string; domain: string }>({
    emailId: '',
    domain: '',
  });
  const [password, setPassword] = useState({
    password: '',
    confirmPassword: '',
  });
  const [code, setCode] = useState('');

  const handleEmailChange = (newEmail: { emailId: string; domain: string }) => {
    setEmail(newEmail);
  };

  const handlePasswordChange = (value: string) => {
    setPassword((prev) => ({
      ...prev,
      password: value,
    }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setPassword((prev) => ({
      ...prev,
      confirmPassword: value,
    }));
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  return {
    form: {
      email,
      password: password.password,
      confirmPassword: password.confirmPassword,
      code,
    },
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleCodeChange,
  };
};

export default useChangeHandler;
