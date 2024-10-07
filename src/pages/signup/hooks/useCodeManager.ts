import { useState } from 'react';
import { sendCode } from 'api';
import { isValidResponse } from 'api';
import { useTranslation } from 'react-i18next';

const useCodeManager = (
  isEmailChecked: boolean,
  email: { emailId: string; domain: string }
) => {
  const { t } = useTranslation();

  const [code, setCode] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleSendCode = async () => {
    if (!isEmailChecked) {
      setError(t('signup.noEmailCheckError'));
      return;
    }

    try {
      const emailString = `${email.emailId}@${email.domain}`;
      const response = await sendCode(emailString);
      if (isValidResponse(response)) {
        setSuccess(t('signup.codeSent'));
        setError('');
        setIsCodeSent(true);
      } else {
        setSuccess('');
        setError(t('signup.codeSendFailed'));
        setIsCodeSent(false);
      }
    } catch (error) {
      setSuccess('');
      setError(t('signup.codeSendFailed'));
      setIsCodeSent(false);
    }
  };

  return {
    code,
    isCodeSent,
    success,
    error,
    handleCodeChange,
    handleSendCode,
  };
};

export default useCodeManager;