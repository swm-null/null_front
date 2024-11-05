import { useRef } from 'react';
import { CloseIcon } from 'assets/icons';
import { useClickWithoutDrag } from 'pages/hooks';

interface ImageItemProps {
  image: File | string;
  index: number;
  editable: boolean;
  onRemove?: (index: number) => void;
}

const ImageItem = ({ image, index, editable, onRemove }: ImageItemProps) => {
  const imageUrl = image instanceof File ? URL.createObjectURL(image) : image;
  const removeButtonRef = useRef<HTMLDivElement>(null);

  const { handleMouseDown, handleMouseMove } = useClickWithoutDrag(
    onRemove ? () => onRemove(index) : () => {}
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (removeButtonRef.current) {
      removeButtonRef.current.dataset.isDragging = 'false';
    }
    handleMouseDown(e);
  };

  return (
    <div className="carousel-cell w-full h-full xsm:w-60" key={index}>
      <img
        src={imageUrl}
        alt={`Memo Image ${index + 1}`}
        className="object-cover w-full h-full xsm:w-60"
      />
      {editable && (
        <div
          ref={removeButtonRef}
          className="remove-button absolute top-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleRemove}
        >
          <CloseIcon className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ImageItem;
