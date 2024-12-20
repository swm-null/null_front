import { useState } from 'react';

const useChangeHandlerManager = () => {
  const [email, setEmail] = useState<{ emailId: string; domain: string }>({
    emailId: '',
    domain: '',
  });
  const [password, setPassword] = useState({
    password: '',
    confirmPassword: '',
  });
  const [name, setName] = useState('');
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

  const handleNameChange = (name: string) => {
    setName(name);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  return {
    form: {
      email,
      password: password.password,
      confirmPassword: password.confirmPassword,
      name,
      code,
    },
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleNameChange,
    handleCodeChange,
  };
};

export default useChangeHandlerManager;
