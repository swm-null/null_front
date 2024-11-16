import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, Box } from '@mui/material';
import { KakaoDropzone, CopyTextField } from './components';
import { uploadDataIOS } from 'assets/images';
import { createMemos, isFilesResponse, isValidResponse, uploadFile } from 'api';

const UploadData = ({
  handleProProcess,
  email,
}: {
  handleProProcess: () => void;
  email: string | null;
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const [file, setFile] = useState<File | null>(null);

  const serverMail = 'test@oatnote.io';

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getFileUrl = async (file: File): Promise<string> => {
    const response = await uploadFile(file);
    if (!isFilesResponse(response))
      throw new Error('파일 업로드에 문제가 생겼습니다.');

    return response.urls[0];
  };

  const handleUploadData = async () => {
    if (!file || !email) return;

    const fileUrl = await getFileUrl(file);

    try {
      const response = await createMemos(fileUrl, email);
      if (!isValidResponse(response)) {
        // FIXME: 안되는 경우 에러 처리
      }
    } catch {}
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
                  <KakaoDropzone kakaoCsvFile={file} setKakaoCsvFile={setFile} />
                </div>
              </div>
              <button
                type="button"
                className={`${!file ? 'bg-gray1 text-gray3' : 'bg-gray2 text-white'} mt-auto w-full rounded-lg py-2 px-6`}
                disabled={!file}
                onClick={() => {
                  handleProProcess();
                  handleUploadData();
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
