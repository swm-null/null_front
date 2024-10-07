import { useState } from 'react';
import { checkEmail } from 'api';
import { isValidResponse } from 'api';
import { useTranslation } from 'react-i18next';

const useEmailManager = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState({ emailId: '', domain: '' });
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (newEmail: { emailId: string; domain: string }) => {
    setEmail(newEmail);
    setIsEmailChecked(false);
  };

  const handleCheckEmail = async () => {
    try {
      const emailString = `${email.emailId}@${email.domain}`;
      const response = await checkEmail(emailString);

      if (isValidResponse(response)) {
        setIsEmailChecked(true);
        setSuccess(t('signup.checkEmailSuccess'));
        setError('');
      } else if (response.exceptionCode === 1004) {
        setSuccess('');
        setError(t('signup.emailAlreadyExists'));
      } else {
        setSuccess('');
        setError(t('signup.signupErrorMessage'));
      }
    } catch (error) {
      setSuccess('');
      setError(t('signup.signupErrorMessage'));
    }
  };

  return {
    email,
    isEmailChecked,
    success,
    error,
    handleEmailChange,
    handleCheckEmail,
  };
};

export default useEmailManager;
