import { useTranslation } from 'react-i18next';
import { AnimatedHeader } from 'pages/home/contents/@components';
import { SIDEBAR_HEADER_ANIMATION_DURATION } from 'pages/home/constants';
import { KakaoDropzone } from './KakaoDropzone';

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
      <div className="pb-4 px-4 flex flex-col flex-1 overflow-hidden">
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
