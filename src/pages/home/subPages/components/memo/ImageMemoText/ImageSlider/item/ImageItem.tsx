import { CloseIcon } from 'assets/icons';

interface ImageItemProps {
  image: File | string;
  index: number;
  editable: boolean;
}

const ImageItem = ({ image, index, editable }: ImageItemProps) => {
  const imageUrl = image instanceof File ? URL.createObjectURL(image) : image;

  return (
    <div className="carousel-cell w-full h-full xsm:w-60" key={index}>
      <img
        src={imageUrl}
        alt={`Memo Image ${index + 1}`}
        className="object-cover w-full h-full xsm:w-60"
      />
      {editable && (
        <div className="remove-button absolute top-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer">
          <CloseIcon className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ImageItem;
