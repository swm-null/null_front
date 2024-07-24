import { useDropzone } from 'react-dropzone';

const KakaoDropzone = () => {
  const { acceptedFiles, getRootProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
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
        className="bg-[#F0F0F0] p-5"
      >
        <p className="text-center">
          Drag 'n' drop some files here, or click to select files
        </p>
        <p className="text-center">
          Only *.jpeg and *.png images will be accepted
        </p>
      </div>
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
      </aside>
    </section>
  );
};

export default KakaoDropzone;
