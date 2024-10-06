import { useMemo } from 'react';

interface CodeSendFormProps {
  email: { emailId: string; domain: string };
  password: string;
  confirmPassword: string;
  name: string;
  code: string;
}

const useValidationManager = ({
  email,
  password,
  confirmPassword,
  name,
  code,
}: CodeSendFormProps) => {
  const isEmailValid = useMemo(() => {
    const emailIdRegex = /^[a-zA-Z0-9._%+-]+$/;
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isValidEmailId = emailIdRegex.test(email.emailId);
    const isValidDomain = domainRegex.test(email.domain);

    return isValidEmailId && isValidDomain;
  }, [email]);

  const isPasswordValid = useMemo(() => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  }, [password]);

  const isConfirmPasswordValid = useMemo(() => {
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const isNameValid = useMemo(() => {
    return name !== '';
  }, [name]);

  const isCodeValid = useMemo(() => {
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
  }, [code]);

  return {
    isEmailValid,
    isPasswordValid,
    isConfirmPasswordValid,
    isNameValid,
    isCodeValid,
  };
};

export default useValidationManager;
