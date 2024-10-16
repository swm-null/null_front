import { CloseIcon } from 'assets/icons';

interface ImageListProps {
  images: File[];
  removeImage: (index: number) => void;
}

const ImageList = ({ images, removeImage }: ImageListProps) => {
  if (images.length === 0) return null;

  return (
    <div className="w-full flex gap-5">
      {images.map((image, index) => (
        <div key={index} className="relative h-24">
          <img
            src={URL.createObjectURL(image)} // 수정된 부분
            alt="Pasted content"
            className="h-full max-w-full object-contain rounded-lg"
          />
          <div
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer"
            onClick={() => removeImage(index)}
          >
            <CloseIcon className="w-4 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageList;
