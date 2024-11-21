import { DeleteIcon, ExportIcon } from 'assets/icons';
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

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': [],
    },
    multiple: false,
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setKakaoCsvFile(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  const handleRemoveFile = () => {
    setKakaoCsvFile(null);
  };

  return (
    <section>
      <div
        {...getRootProps({
          className: `bg-white bg-opacity-35 border-2 border-dashed rounded-lg 
            p-6 flex flex-col items-center justify-center cursor-pointer transition-all 
          ${isDragActive ? 'border-blue-500 ' : 'border-gray-300'}`,
        })}
      >
        <input {...getInputProps()} />

        {kakaoCsvFile ? (
          <div className="flex items-center bg-white shadow-sm rounded-lg p-3 mt-2 gap-2">
            <p className="text-gray-600 flex-1">
              {kakaoCsvFile.name} - {kakaoCsvFile.size} bytes
            </p>
            <button
              type="button"
              className="text-[#604B3D] font-medium hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
            >
              <DeleteIcon />
            </button>
          </div>
        ) : (
          <div className="text-center place-items-center">
            <ExportIcon />
            <p className="text-gray-600 whitespace-pre">
              {t('pages.uploadData.dropzone.text1')}
            </p>
            <p className="text-sm text-gray-400">
              {t('pages.uploadData.dropzone.text2')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default KakaoDropzone;
