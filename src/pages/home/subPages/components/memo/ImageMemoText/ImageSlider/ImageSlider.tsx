import { useContext, useMemo, useState } from 'react';
import { ImageListContext } from 'utils';
import { ImageLightbox } from './ImageLightbox';
import { FlickityWrapper } from './FlickityWrapper';
import { AddItem, ImageItem } from './item';

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

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const allImages = useMemo(() => {
    const objectUrls = editable ? images.map((img) => URL.createObjectURL(img)) : [];
    return [...(imageUrls || []), ...objectUrls];
  }, [imageUrls, images]);

  const isNoImages = () => allImages.length === 0;

  const handleRemoveClick = (index: number) => {
    if (index < imageUrls?.length) {
      removeImageUrl?.(index);
    } else {
      removeImage(index - imageUrls?.length);
    }
  };

  const handleImageClick = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  if (isNoImages()) {
    return <></>;
  }

  return (
    <div className="xs:w-60 w-full max-w-72 rounded-2xl overflow-hidden">
      <FlickityWrapper
        showPageDots={!!imageUrls}
        onImageClick={handleImageClick}
        onRemoveClick={editable ? handleRemoveClick : null}
        onAddClick={editable ? handleAddImageButtonClick : null}
        totalImageCount={allImages.length}
      >
        {allImages.map((image, index) => (
          <ImageItem
            key={`origin-${index}`}
            image={image}
            index={index}
            editable={editable}
          />
        ))}
        {editable && <AddItem handleImageFilesChange={handleImageFilesChange} />}
      </FlickityWrapper>

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
