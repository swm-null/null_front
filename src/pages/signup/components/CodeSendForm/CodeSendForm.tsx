import { CustomInput } from 'pages/components';
import { useTranslation } from 'react-i18next';

interface CodeSendFormProps {
  code: string;
  handleCodeChange: (code: string) => void;
  handleSendCode: () => void;
  success?: { flag: boolean; message: string };
  error?: { flag: boolean; message: string };
}

const CodeSendForm = ({
  code,
  handleCodeChange,
  handleSendCode,
  success,
  error,
}: CodeSendFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <CustomInput
          label={t('utils.auth.code')}
          value={code}
          setValue={handleCodeChange}
        />
        <button
          type="button"
          className="h-[2.626rem] self-end ml-auto px-4 py-2 bg-[#F4CDB1] text-[#6A5344] text-[0.9375rem] 
            rounded-lg flex-shrink-0"
          onClick={handleSendCode}
        >
          {t('signup.sendCode')}
        </button>
      </div>
      {success?.flag && (
        <p className="text-green-500 text-sm">{success.message}</p>
      )}
      {error?.flag && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default CodeSendForm;
