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
          <p>1. 다음 이메일을 복사하세요</p>
          <CopyTextField text="test@oatnote.io" />
        </div>

        {/* TODO: 튜토리얼 추가하기 */}
        <p>2. 카카오톡을 열어서 다음 이미지를 따라하세요. (추가 예정)</p>
        <p className="mb-5">
          3. 수신자에 복사한 이메일을 붙여넣고, 메일을 전송하세요.
        </p>

        <p>
          노트북으로 데이터 파일을 저장한 경우, 해당 파일을 dropzone에
          추가해주세요.
        </p>
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
