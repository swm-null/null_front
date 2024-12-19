import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KakaoDropzone, CopyTextField } from './components';
import { email1, email2, kakao1, kakao2 } from 'assets/images';
import { BottomNavContext } from 'utils';
import { createMemos } from './api';
import { isFilesResponse, uploadFile } from 'pages/home/api';
import { isValidResponse } from 'pages/api';

const UploadData = ({
  handleProProcess,
  email,
}: {
  handleProProcess: () => void;
  email: string | null;
}) => {
  const { t } = useTranslation();
  const { isSmallScreen } = useContext(BottomNavContext);

  const thirdImageRef = useRef<HTMLImageElement>(null);
  const email1Ref = useRef<HTMLImageElement>(null);
  const email2Ref = useRef<HTMLImageElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [lastImageHeight, setLastImageHeight] = useState<number | null>(null);

  const serverMail = 'import@oatnote.io';

  const getFileUrl = async (file: File): Promise<string> => {
    const response = await uploadFile(file);
    if (!isFilesResponse(response)) {
      throw new Error('파일 업로드에 문제가 생겼습니다.');
    }
    return response.urls[0];
  };

  const handleUploadData = async () => {
    if (!file || !email) return;

    const fileUrl = await getFileUrl(file);

    try {
      const response = await createMemos(fileUrl, email);
      if (!isValidResponse(response)) {
        // FIXME: 실패 시 처리
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const updateHeight = () => {
      if (email1Ref.current && email2Ref.current) {
        const height1 = email1Ref.current.offsetHeight;
        const height2 = email2Ref.current.offsetHeight;
        setLastImageHeight(Math.max(height1, height2));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 h-full text-gray3">
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex flex-col flex-1 gap-3 text-[#604B3D]">
          <p className="font-bold text-xl">카카오톡 대화 내용을 메모로 불러와요.</p>
          <div className="flex flex-col gap-1">
            <p>대화 내용은 이메일로 업로드하거나, 직접 업로드 할 수 있어요.</p>
            <p>이메일을 이용하려면 아래 이메일을 먼저 복사해주세요.</p>
            <CopyTextField text={serverMail} />
          </div>

          <div className="flex flex-col gap-4">
            <p>1. 카카오톡에서 대화 내용을 내보내요.</p>
            <div
              style={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                flexWrap: isSmallScreen ? 'nowrap' : 'wrap',
                gap: isSmallScreen ? '20px' : '20px',
              }}
              className="p-4 rounded-2xl bg-[#F7DBC2]"
            >
              <img
                src={kakao1}
                ref={thirdImageRef}
                alt="iOS upload instructions"
                className="flex flex-shrink-0"
                style={{
                  width: isSmallScreen ? '100%' : 'calc(50% - 10px)',
                  height: 'auto',
                }}
                onClick={() => {
                  window.open(kakao1);
                }}
              />
              <img
                src={kakao2}
                alt="iOS upload instructions"
                className="flex flex-shrink-0"
                style={{
                  width: isSmallScreen ? '100%' : 'calc(50% - 10px)',
                  height: 'auto',
                }}
                onClick={() => {
                  window.open(kakao2);
                }}
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-3">
            <p>{t('pages.uploadData.emailInstruction.kakaoExport')}</p>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col flex-1">
                <KakaoDropzone kakaoCsvFile={file} setKakaoCsvFile={setFile} />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                flexWrap: isSmallScreen ? 'nowrap' : 'wrap',
                gap: isSmallScreen ? '20px' : '20px',
              }}
              className="p-4 rounded-2xl bg-[#F7DBC2]"
            >
              <img
                src={email1}
                ref={email1Ref}
                alt="iOS upload instructions"
                className="flex w-fit"
                style={{
                  height: lastImageHeight || 'auto',
                }}
                onClick={() => {
                  window.open(email1);
                }}
              />
              <img
                src={email2}
                ref={email2Ref}
                alt="iOS upload instructions"
                className="flex w-fit"
                style={{
                  height: lastImageHeight || 'auto',
                }}
                onClick={() => {
                  window.open(email2);
                }}
              />
            </div>
          </div>
          <button
            type="button"
            className={`${!file ? 'bg-[#F7DBC2] bg-opacity-50 text-brown1' : 'bg-[#F7DBC2]'} mt-auto w-full rounded-lg py-2 px-6`}
            disabled={!file}
            onClick={() => {
              handleProProcess();
              handleUploadData();
            }}
          >
            {t('pages.uploadData.createMemoButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadData;
