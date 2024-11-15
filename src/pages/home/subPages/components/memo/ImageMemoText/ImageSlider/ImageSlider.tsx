import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ImageLightbox } from './ImageLightbox';
import { FlickityWrapper } from './FlickityWrapper';
import { AddItem, ImageItem } from './item';
import { PageDots } from './PageDots';

const ImageSlider = ({
  imageUrls,
  removeImageUrl,
  handleImageFilesChange,
  editable = false,
}: {
  imageUrls: string[];
  removeImageUrl?: (index: number) => void;
  handleImageFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const addImageInputRef = useRef<HTMLInputElement>(null);
  const showPageDots = (imageUrls.length >= 1 && editable) || imageUrls.length >= 2;

  const isNoImages = () => imageUrls.length === 0;

  const handleRemoveClick = (index: number) => {
    removeImageUrl?.(index);
  };

  const handleImageClick = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const imageItems = imageUrls.map((image, index) => (
    <ImageItem
      key={`image-${image}`}
      image={image}
      index={index}
      editable={editable}
    />
  ));

  useEffect(() => {
    if (photoIndex >= imageUrls.length) {
      setPhotoIndex(0);
    }
  }, [editable]);

  useEffect(() => {
    setPhotoIndex(0);
  }, [imageUrls]);

  if (isNoImages()) {
    return null;
  }

  return (
    <>
      <div className="xs:w-60 w-full max-w-72 rounded-2xl overflow-hidden">
        <FlickityWrapper
          onImageClick={handleImageClick}
          addImageInputRef={addImageInputRef}
          onRemoveClick={editable ? handleRemoveClick : null}
          totalImageCount={imageUrls.length}
          onChange={setPhotoIndex}
          currentIndex={photoIndex}
        >
          {imageItems}
          {editable && (
            <AddItem
              addImageInputRef={addImageInputRef}
              handleImageFilesChange={handleImageFilesChange}
            />
          )}
        </FlickityWrapper>
      </div>
      {showPageDots && (
        <PageDots
          allImages={imageUrls}
          photoIndex={photoIndex}
          setPhotoIndex={setPhotoIndex}
          editable={editable}
        />
      )}
      <ImageLightbox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        photoIndex={photoIndex}
        setPhotoIndex={setPhotoIndex}
        images={imageUrls}
      />
    </>
  );
};

export default ImageSlider;
