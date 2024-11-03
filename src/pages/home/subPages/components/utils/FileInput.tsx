import { ChangeEvent, ReactNode } from 'react';

interface FileInputProps {
  ALLOWED_FILE_TYPES: string[];
  handleClick?: () => void;
  handleImageFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
  className?: string;
}

const FileInput = ({
  ALLOWED_FILE_TYPES,
  handleClick,
  handleImageFileChange,
  children,
  className,
}: FileInputProps) => {
  return (
    <form className={className} onClick={handleClick}>
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
