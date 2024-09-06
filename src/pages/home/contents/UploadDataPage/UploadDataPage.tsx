import { useTranslation } from 'react-i18next';
import { AnimatedHeader } from 'pages/home/contents/_components';
import { SIDEBAR_HEADER_ANIMATION_DURATION } from 'pages/home/constants';
import { KakaoDropzone } from './components/KakaoDropzone';
import { CopyTextField } from './components';

const UploadDataPage = ({
  headerLeftMarginToggle = false,
  headerLeftMargin = 0,
}: {
  headerLeftMarginToggle?: boolean;
  headerLeftMargin?: number;
}) => {
  const { t } = useTranslation();

  // TODO: 서버에 메일을 요청하는 api 추가되면 변경
  const serverMail = 'test@oatnote.io';

  return (
    <div className="flex flex-col flex-1 h-screen text-gray2">
      <AnimatedHeader
        text={t('pages.uploadData.header')}
        leftMarginToggle={headerLeftMarginToggle}
        leftMargin={headerLeftMargin}
        animationDuration={SIDEBAR_HEADER_ANIMATION_DURATION}
      />
      <div className="pb-4 px-4 flex flex-col flex-1 overflow-hidden gap-2">
        <div>
          <p>{t('pages.uploadData.copyEmailInstruction')}</p>
          <CopyTextField text={serverMail} />
        </div>

        {/* TODO: 튜토리얼 추가하기 */}
        <p>{t('pages.uploadData.followInstructions')}</p>
        <p className="mb-5">{t('pages.uploadData.pasteEmailInstruction')}</p>

        <p>{t('pages.uploadData.uploadFileInstruction')}</p>
        <div className="flex flex-col flex-1">
          <KakaoDropzone />
        </div>
        <button
          className="mt-2 bg-gray2 text-white rounded-lg py-2 px-6"
          onClick={() => {}}
        >
          {t('pages.uploadData.addMemoButton')}
        </button>
      </div>
    </div>
  );
};

export default UploadDataPage;
