import { useTranslation } from 'react-i18next';
import { AnimatedHeader } from 'pages/home/contents/@components';
import { SIDEBAR_HEADER_ANIMATION_DURATION } from 'pages/home/constants';

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
      <div className="pb-4 px-4 flex flex-col flex-1 overflow-hidden"></div>
      <div></div>
    </div>
  );
};

export default UploadDataPage;
