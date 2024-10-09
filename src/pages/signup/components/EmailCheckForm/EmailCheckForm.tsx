import { useTranslation } from 'react-i18next';
import { EmailInput } from './EmailInput';

interface EmailCheckFormProps {
  email: { emailId: string; domain: string };
  handleEmailChange: (newEmail: { emailId: string; domain: string }) => void;
  handleCheckEmail: () => void;
  isEmailInputTouched?: boolean;
  success: string;
  error: string;
}

const EmailCheckForm = ({
  email,
  handleEmailChange,
  handleCheckEmail,
  isEmailInputTouched,
  success,
  error,
}: EmailCheckFormProps) => {
  const { t } = useTranslation();

  return (
    <>
      <p className="block text-sm font-medium text-gray-700">
        {t('signup.email')}
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <EmailInput value={email} onChange={handleEmailChange} />
          <button
            type="button"
            className="h-[2.626rem] self-end ml-auto px-4 py-2 bg-[#F4CDB1] text-[#6A5344] text-[0.9375rem]
              rounded-lg flex-shrink-0"
            onClick={handleCheckEmail}
          >
            {t('signup.checkEmail')}
          </button>
        </div>
        {isEmailInputTouched && success && (
          <p className="text-green-500 text-sm">{success}</p>
        )}
        {isEmailInputTouched && error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </>
  );
};

export default EmailCheckForm;
