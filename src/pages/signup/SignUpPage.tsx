import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LoginSignUpButton, HiddenInput } from 'pages/components';
import { EmailInput } from './components';
import { isValidResponse, signup } from 'utils/auth';

const SignUpPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState({ emailId: '', domain: '' });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isEmailInputTouched, setIsEmailInputTouched] = useState(false);
  const [isPasswordInputTouched, setIsPasswordInputTouched] = useState(false);
  const [isConfirmPasswordInputTouched, setIsConfirmPasswordInputTouched] =
    useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const validateEmail = () => {
    const emailIdRegex = /^[a-zA-Z0-9._%+-]+$/;
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isValidEmailId = emailIdRegex.test(email.emailId);
    const isValidDomain = domainRegex.test(email.domain);

    return isValidEmailId && isValidDomain;
  };

  const validatePassword = () => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateConfirmPassword = () => {
    return password === confirmPassword;
  };

  const getFormValidAndSetErrors = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', confirmPassword: '' };

    if (isEmailInputTouched && !validateEmail()) {
      newErrors.email = t('signUp.invalidEmail');
      isValid = false;
    }

    if (isPasswordInputTouched && !validatePassword()) {
      newErrors.password = t('signUp.invalidPassword');
      isValid = false;
    }

    if (isConfirmPasswordInputTouched && !validateConfirmPassword()) {
      newErrors.confirmPassword = t('signUp.passwordsDoNotMatch');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    const isValid = !getFormValidAndSetErrors();
    if (
      ![
        isEmailInputTouched,
        isPasswordInputTouched,
        isConfirmPasswordInputTouched,
      ].includes(false)
    ) {
      setIsButtonDisabled(isValid);
    }
  }, [email, password, confirmPassword]);

  const handleSignUp = async () => {
    if (!getFormValidAndSetErrors()) {
      return;
    }

    const response = await signup(
      `${email.emailId}@${email.domain}`,
      password,
      confirmPassword
    );
    if (isValidResponse(response)) {
      navigate(-1);
    }
  };

  const handleEmailChange = (newEmail: { emailId: string; domain: string }) => {
    setEmail(newEmail);
    setIsEmailInputTouched(true);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setIsPasswordInputTouched(true);
  };

  const handleConfirmPasswordChange = (newConfirmPassword: string) => {
    setConfirmPassword(newConfirmPassword);
    setIsConfirmPasswordInputTouched(true);
  };

  return (
    <div className="bg-custom-gradient-basic flex justify-center items-center h-screen bg-gray-100 py-8">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg overflow-y-auto">
        <div className="mb-6">
          <label
            htmlFor="emailId"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {t('signUp.email')}
          </label>
          <EmailInput value={email} onChange={handleEmailChange} />
          {isEmailInputTouched && errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}

          <HiddenInput
            label={t('signUp.password')}
            value={password}
            setValue={handlePasswordChange}
            errorMessage={isPasswordInputTouched ? errors.password : ''}
          />

          <HiddenInput
            label={t('signUp.confirmPassword')}
            value={confirmPassword}
            setValue={handleConfirmPasswordChange}
            errorMessage={
              isConfirmPasswordInputTouched ? errors.confirmPassword : ''
            }
          />
        </div>
        <LoginSignUpButton
          label={t('signUp.signUpButton')}
          onClick={handleSignUp}
          bgColor="#3B82F6"
          hoverColor="#2563EB"
          additionalClasses="bg-[#3B82F6] text-white"
          disabled={isButtonDisabled}
        />
      </form>
    </div>
  );
};

export default SignUpPage;
