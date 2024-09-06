import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

const KakaoDropzone = () => {
  const { t } = useTranslation();

  const [kakaoCsvFiles, setKakaoCsvFiles] = useState<File[]>([]);
  const { acceptedFiles, getRootProps } = useDropzone({
    accept: {
      'text/csv': [],
    },
  });

  useEffect(() => {
    setKakaoCsvFiles((prev) => {
      const newFiles = acceptedFiles.filter(
        (file) =>
          !prev.some(
            (prevFile) =>
              prevFile.name === file.name && prevFile.size === file.size
          )
      );
      return [...prev, ...newFiles];
    });
  }, [acceptedFiles]);

  const handleRemoveFile = (fileToRemove: File) => {
    setKakaoCsvFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const acceptedFileItems = kakaoCsvFiles?.map((file) => (
    <div key={file.name} className="flex items-center">
      <p className="inline items-center">
        {file.name} - {file.size} bytes
      </p>
      <div className="flex-grow"></div>
      <button
        className="bg-gray2 text-white rounded-lg px-3 py-1"
        onClick={() => handleRemoveFile(file)}
      >
        {t('pages.uploadData.kakaoAcceptedFiles.deleteButton')}
      </button>
    </div>
  ));

  return (
    <section>
      <div
        {...getRootProps({ className: 'dropzone' })}
        className="bg-[#F0F0F0] py-10"
      >
        <p className="text-center">{t('pages.uploadData.dropzone.text1')}</p>
        <p className="text-center">{t('pages.uploadData.dropzone.text2')}</p>
      </div>
      {kakaoCsvFiles.length !== 0 && (
        <aside>
          <p className="mt-5 mb-1">
            {t('pages.uploadData.kakaoAcceptedFiles.header')}
          </p>
          <ul>{acceptedFileItems}</ul>
        </aside>
      )}
    </section>
  );
};

export default KakaoDropzone;
