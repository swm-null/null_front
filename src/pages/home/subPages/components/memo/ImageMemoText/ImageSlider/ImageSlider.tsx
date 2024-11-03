import { useContext, useEffect, useState } from 'react';
import Flickity from 'react-flickity-component';
import { ImageListContext } from 'utils';
import { ImageFileInput } from 'pages/home/subPages/components/utils';
import { AddIcon, CloseIcon } from 'assets/icons';

const ImageSlider = ({
  imageUrls,
  removeImageUrl,
  editable = false,
}: {
  imageUrls: string[];
  removeImageUrl?: (index: number) => void;
  editable?: boolean;
}) => {
  const { images, removeImage, handleAddImageButtonClick, handleImageFilesChange } =
    useContext(ImageListContext);

  const [flickityInstance, setFlickityInstance] = useState<Flickity | null>(null);

  const isNoImages = () => imageUrls?.length + images.length === 0;
  const isLastImageIndex = (cellIndex: number) =>
    cellIndex === imageUrls?.length + images.length;

  useEffect(() => {
    if (flickityInstance) {
      const handleStaticClick = (_: any, __: any, ___: any, cellIndex: number) => {
        if (cellIndex && isLastImageIndex(cellIndex)) {
          handleAddImageButtonClick();
        }
      };

      flickityInstance.on('staticClick', handleStaticClick);

      return () => {
        flickityInstance.off('staticClick', handleStaticClick);
      };
    }
  }, [flickityInstance, imageUrls, editable]);

  const flickityOptions = {
    prevNextButtons: false,
    pageDots: imageUrls ? true : undefined,
    setGallerySize: false,
  };

  if (isNoImages()) {
    return <></>;
  }

  return (
    <div className="xs:w-60 w-full max-w-72 rounded-2xl overflow-hidden">
      <Flickity
        flickityRef={(instance) => setFlickityInstance(instance)}
        elementType="div"
        className="carousel w-full h-full aspect-square"
        options={flickityOptions}
      >
        {imageUrls?.map((url, index) => (
          <ImageItem
            key={`origin-${index}`}
            image={url}
            index={index}
            onRemove={removeImageUrl}
            editable={editable}
          />
        ))}

        {images?.map((image, index) => (
          <ImageItem
            key={`new-${index}`}
            image={image}
            index={index}
            onRemove={removeImage}
            editable={editable}
          />
        ))}

        {editable && (
          <div className="carousel-cell flex items-center justify-center w-full h-full bg-gray-200 xsm:w-60">
            <ImageFileInput handleImageFileChange={handleImageFilesChange}>
              <AddIcon className="w-10 h-10" onClick={handleAddImageButtonClick} />
            </ImageFileInput>
          </div>
        )}
      </Flickity>
    </div>
  );
};

const ImageItem = ({
  image,
  index,
  editable,
  onRemove,
}: {
  image: File | string;
  index: number;
  editable: boolean;
  onRemove?: (index: number) => void;
}) => {
  const imageUrl = image instanceof File ? URL.createObjectURL(image) : image;

  return (
    <div className="carousel-cell w-full h-full xsm:w-60" key={index}>
      <img
        src={imageUrl}
        alt={`Memo Image ${index + 1}`}
        className="object-cover w-full h-full xsm:w-60"
      />
      {editable && (
        <div
          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer"
          onClick={() => onRemove && onRemove(index)}
        >
          <CloseIcon className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
