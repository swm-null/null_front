import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

const KakaoDropzone = ({
  kakaoCsvFile,
  setKakaoCsvFile,
}: {
  kakaoCsvFile: File | null;
  setKakaoCsvFile: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const { t } = useTranslation();

  const { acceptedFiles, getRootProps } = useDropzone({
    accept: {
      'text/csv': [],
    },
    multiple: false, // 한 번에 하나의 파일만 허용
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      // 새로운 파일이 드롭되면 상태를 교체
      setKakaoCsvFile(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  const handleRemoveFile = () => {
    // 파일 제거
    setKakaoCsvFile(null);
  };

  return (
    <section>
      {/* 드롭존 */}
      <div
        {...getRootProps({ className: 'dropzone' })}
        className="bg-[#F0F0F0] py-10 rounded-lg overflow-hidden"
      >
        <p className="text-center">{t('pages.uploadData.dropzone.text1')}</p>
        <p className="text-center">{t('pages.uploadData.dropzone.text2')}</p>
      </div>

      {/* 파일 상태 표시 */}
      {kakaoCsvFile && (
        <aside>
          <p className="mt-5 mb-1">
            {t('pages.uploadData.kakaoAcceptedFiles.header')}
          </p>
          <div className="flex items-center">
            <p className="inline items-center">
              {kakaoCsvFile.name} - {kakaoCsvFile.size} bytes
            </p>
            <div className="flex-grow"></div>
            <button
              type="button"
              className="bg-gray2 text-white rounded-lg px-3 py-1"
              onClick={handleRemoveFile}
            >
              {t('pages.uploadData.kakaoAcceptedFiles.deleteButton')}
            </button>
          </div>
        </aside>
      )}
    </section>
  );
};

export default KakaoDropzone;
