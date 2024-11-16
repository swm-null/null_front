import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, Box } from '@mui/material';
import { KakaoDropzone } from './components/KakaoDropzone';
import { CopyTextField } from './components';
import { uploadDataIOS } from 'assets/images';

const UploadData = ({ handleProProcess }: { handleProProcess: () => void }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const serverMail = 'test@oatnote.io';

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div className="flex flex-col flex-1 h-screen text-gray3">
      <Box className="flex flex-col flex-1 overflow-hidden gap-2">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          className="mb-4"
        >
          <Tab label={t('pages.uploadData.emailInstruction.header')} />
          <Tab label={t('pages.uploadData.uploadFileInstruction.header')} />
        </Tabs>

        <Box className="h-96 flex flex-col overflow-y-scroll scrollbar-thin">
          {activeTab === 0 && (
            <Box className="flex flex-col flex-1 gap-3">
              <div className="flex flex-col gap-1">
                <p>1. {t('pages.uploadData.emailInstruction.copyEmail')}</p>
                <CopyTextField text={serverMail} />
              </div>
              <p>2. {t('pages.uploadData.emailInstruction.kakaoExport')}</p>
              <img
                src={uploadDataIOS}
                alt="iOS upload instructions"
                className="w-full"
              />
              <p className="mb-5">
                3. {t('pages.uploadData.emailInstruction.sendMail')}
              </p>
            </Box>
          )}

          {activeTab === 1 && (
            <Box className="flex flex-col flex-1 gap-3">
              <p>1. {t('pages.uploadData.emailInstruction.kakaoExport')}</p>
              <img
                src={uploadDataIOS}
                alt="iOS upload instructions"
                className="w-full"
              />
              <div className="flex flex-col gap-1">
                <p>2. {t('pages.uploadData.uploadFileInstruction.text')}</p>
                <div className="flex flex-col flex-1">
                  <KakaoDropzone />
                </div>
              </div>
              <button
                type="button"
                className="mt-auto w-full bg-gray2 text-white rounded-lg py-2 px-6"
                onClick={() => {
                  handleProProcess();
                }}
              >
                {t('pages.uploadData.createMemoButton')}
              </button>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default UploadData;
