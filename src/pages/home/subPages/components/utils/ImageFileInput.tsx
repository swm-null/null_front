import { ChangeEvent, ReactNode } from 'react';
import { useImageList } from '../../hooks';

interface ImageFileInputProps {
  handleClick?: () => void;
  handleImageFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
  className?: string;
}

const ImageFileInput = ({
  handleClick,
  handleImageFileChange,
  children,
  className,
}: ImageFileInputProps) => {
  const { ALLOWED_IMAGE_FILE_TYPES } = useImageList();

  return (
    <form className={className} onClick={handleClick}>
      <input
        id="image-file-input"
        title="input-file"
        type="file"
        accept={ALLOWED_IMAGE_FILE_TYPES.join(', ')}
        onChange={handleImageFileChange}
        className="hidden"
      />
      {children}
    </form>
  );
};

export default ImageFileInput;
