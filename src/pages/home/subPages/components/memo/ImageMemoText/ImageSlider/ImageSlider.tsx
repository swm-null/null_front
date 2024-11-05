import { useContext, useMemo, useState, useEffect } from 'react';
import Flickity from 'react-flickity-component';
import { ImageListContext } from 'utils';
import { ImageFileInput } from 'pages/home/subPages/components/utils';
import { AddIcon } from 'assets/icons';
import 'yet-another-react-lightbox/styles.css';
import ImageLightbox from './ImageLightbox';
import ImageItem from './ImageItem';

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
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const allImages = useMemo(() => {
    const objectUrls = images.map((img) => URL.createObjectURL(img));

    return [...(imageUrls || []), ...objectUrls];
  }, [imageUrls, images]);

  const isNoImages = () => imageUrls?.length + images.length === 0;
  const isLastImageIndex = (cellIndex: number) => cellIndex === allImages?.length;

  useEffect(() => {
    if (!flickityInstance) return;

    const handleStaticClick = (event: any, _: any, __: any, cellIndex: number) => {
      const removeButton = (event.target as HTMLElement).closest('.remove-button');
      if (removeButton instanceof HTMLElement) {
        if (cellIndex < imageUrls?.length) {
          removeImageUrl && removeImageUrl(cellIndex);
        } else {
          removeImage(cellIndex - imageUrls?.length);
        }
        event.preventDefault();
        return;
      }

      if (cellIndex && isLastImageIndex(cellIndex)) {
        handleAddImageButtonClick();
      } else {
        setPhotoIndex(cellIndex);
        setIsOpen(true);
      }
    };

    flickityInstance.on('staticClick', handleStaticClick);

    return () => {
      flickityInstance.off('staticClick', handleStaticClick);
    };
  }, [flickityInstance, imageUrls, images, editable]);

  if (isNoImages()) {
    return <></>;
  }

  const flickityOptions = {
    prevNextButtons: false,
    pageDots: imageUrls ? true : undefined,
    setGallerySize: false,
  };

  return (
    <div className="xs:w-60 w-full max-w-72 rounded-2xl overflow-hidden">
      <Flickity
        elementType="div"
        flickityRef={(instance) => setFlickityInstance(instance)}
        className="carousel w-full h-full aspect-square"
        options={flickityOptions}
      >
        {imageUrls?.map((url, index) => (
          <ImageItem
            key={`origin-${index}`}
            image={url}
            index={index}
            editable={editable}
          />
        ))}
        {images?.map((image, index) => (
          <ImageItem
            key={`new-${index}`}
            image={image}
            index={index}
            editable={editable}
          />
        ))}
        {editable && (
          <div className="carousel-cell flex items-center justify-center w-full h-full bg-gray-200 xsm:w-60">
            <ImageFileInput handleImageFileChange={handleImageFilesChange}>
              <AddIcon className="w-10 h-10" />
            </ImageFileInput>
          </div>
        )}
      </Flickity>

      <ImageLightbox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        photoIndex={photoIndex}
        setPhotoIndex={setPhotoIndex}
        images={allImages}
      />
    </div>
  );
};

export default ImageSlider;
