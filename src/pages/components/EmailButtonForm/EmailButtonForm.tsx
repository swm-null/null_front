import { useTranslation } from 'react-i18next';
import { EmailInput } from './EmailInput';

interface EmailButtonFormProps {
  email: { emailId: string; domain: string };
  buttonText: string;
  handleEmailChange: (newEmail: { emailId: string; domain: string }) => void;
  handleClickButton: () => void;
  success: { flag: boolean; message: string };
  error: { flag: boolean; message: string };
}

const EmailButtonForm = ({
  email,
  buttonText,
  handleEmailChange,
  handleClickButton,
  success,
  error,
}: EmailButtonFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
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
            onClick={handleClickButton}
          >
            {buttonText}
          </button>
        </div>
        {success.flag && (
          <p className="text-green-500 text-sm">{success.message}</p>
        )}
        {error.flag && <p className="text-red-500 text-sm">{error.message}</p>}
      </div>
    </div>
  );
};

export default EmailButtonForm;