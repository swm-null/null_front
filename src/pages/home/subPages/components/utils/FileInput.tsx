import { ChangeEvent, ReactNode } from 'react';

interface FileInputProps {
  ALLOWED_FILE_TYPES: string[];
  handleImageFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
}

const FileInput = ({
  ALLOWED_FILE_TYPES,
  handleImageFileChange,
  children,
}: FileInputProps) => {
  return (
    <form>
      <input
        title="input-file"
        type="file"
        accept={ALLOWED_FILE_TYPES.join(', ')}
        onChange={handleImageFileChange}
        className="hidden"
      />
      {children}
    </form>
  );
};

export default FileInput;
