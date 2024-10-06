import { useTranslation } from 'react-i18next';
import { Header } from 'pages/home/subPages/components';
import { KakaoDropzone } from './components/KakaoDropzone';
import { CopyTextField } from './components';

const UploadData = ({}: {}) => {
  const { t } = useTranslation();

  // TODO: 서버에 메일을 요청하는 api 추가되면 변경
  const serverMail = 'test@oatnote.io';

  return (
    <div className="flex flex-col flex-1 h-screen text-gray3">
      <Header headerText={t('pages.uploadData.header')} />
      <div className="pb-4 px-4 flex flex-col flex-1 overflow-hidden gap-2">
        <p>{t('pages.uploadData.emailInstruction.header')}</p>
        <p>{t('pages.uploadData.emailInstruction.text1')}</p>
        <CopyTextField text={serverMail} />

        {/* TODO: 튜토리얼 추가하기 */}
        <p>{t('pages.uploadData.emailInstruction.text2')}</p>
        <p className="mb-5">{t('pages.uploadData.emailInstruction.text3')}</p>

        <p>{t('pages.uploadData.uploadFileInstruction.header')}</p>
        <p>{t('pages.uploadData.uploadFileInstruction.text')}</p>
        <div className="flex flex-col flex-1">
          <KakaoDropzone />
        </div>
        <button
          className="mt-2 bg-gray3 text-white rounded-lg py-2 px-6"
          onClick={() => {}}
        >
          {t('pages.uploadData.createMemoButton')}
        </button>
      </div>
    </div>
  );
};

export default UploadData;
