import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const KakaoDropzone = () => {
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
    <div key={file.name} className="flex items-center mt-1">
      <p className="inline items-center">
        {file.name} - {file.size} bytes
      </p>
      <div className="flex-grow"></div>
      <button
        className="bg-gray2 text-white rounded-lg px-3 py-1"
        onClick={() => handleRemoveFile(file)}
      >
        삭제
      </button>
    </div>
  ));

  return (
    <section>
      <div
        {...getRootProps({ className: 'dropzone' })}
        className="bg-[#F0F0F0] py-10"
      >
        <p className="text-center">
          Drag 'n' drop some files here, or click to select files
        </p>
        <p className="text-center">Only *.csv files will be accepted</p>
      </div>
      {kakaoCsvFiles.length !== 0 ? (
        <aside>
          <h4>카카오톡 데이터 파일</h4>
          <ul>{acceptedFileItems}</ul>
        </aside>
      ) : (
        <></>
      )}
    </section>
  );
};

export default KakaoDropzone;
