import { ChangeEvent, ReactNode } from 'react';

interface FileInputProps {
  handleImageFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
}

const FileInput = ({ handleImageFileChange, children }: FileInputProps) => {
  return (
    <form>
      <input
        title="input-file"
        type="file"
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />
      {children}
    </form>
  );
};

export default FileInput;
