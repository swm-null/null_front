import { useDropzone } from 'react-dropzone';

const KakaoDropzone = () => {
  const { acceptedFiles, getRootProps } = useDropzone({
    accept: {
      'text/csv': [],
    },
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
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
      {acceptedFiles.length !== 0 ? (
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
