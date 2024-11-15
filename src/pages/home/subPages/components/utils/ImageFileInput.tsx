import {
  ChangeEvent,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { useImageList } from '../../hooks';

interface ImageFileInputProps {
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
  className?: string;
}

const ImageFileInput = forwardRef<HTMLInputElement, ImageFileInputProps>(
  ({ onFileChange, children, className }, ref) => {
    const { ALLOWED_IMAGE_FILE_TYPES } = useImageList();
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    return (
      <div
        className={`cursor-pointer ${className}`}
        onClick={() => {
          if (!ref) inputRef.current?.click();
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGE_FILE_TYPES.join(',')}
          onChange={(e) => onFileChange(e)}
          className="hidden"
        />
        {children}
      </div>
    );
  }
);

export default ImageFileInput;
