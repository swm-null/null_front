import { useContext, useMemo, useState } from 'react';
import { ImageListContext } from 'utils';
import { ImageLightbox } from './ImageLightbox';
import { FlickityWrapper } from './FlickityWrapper';
import { AddItem, ImageItem } from './item';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

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

  const showPageDots =
    (imageUrls.length + images.length >= 1 && editable) || imageUrls.length >= 2;

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
    <>
      <div className="xs:w-60 w-full max-w-72 rounded-2xl overflow-hidden">
        <FlickityWrapper
          onImageClick={handleImageClick}
          onRemoveClick={editable ? handleRemoveClick : null}
          onAddClick={editable ? handleAddImageButtonClick : null}
          totalImageCount={allImages.length}
          onChange={setPhotoIndex}
          currentIndex={photoIndex}
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
      </div>
      {showPageDots && (
        <div className="flex gap-1 justify-center mt-2 h-4">
          {Array.from({ length: allImages.length }).map((_, index) => (
            <button
              type="button"
              className="p-1"
              key={`dot-${index}`}
              onClick={() => setPhotoIndex(index)}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full p-1 self-center ${
                  index === photoIndex ? 'bg-black' : 'bg-gray1'
                }`}
              />
            </button>
          ))}
          {editable && (
            <AddOutlinedIcon
              sx={{ width: 16, height: 16, padding: 0, margin: 0 }}
              className={`cursor-pointer ${
                photoIndex === allImages.length ? 'text-black' : 'text-gray1'
              }`}
              onClick={() => setPhotoIndex(allImages.length)}
            />
          )}
        </div>
      )}
      <ImageLightbox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        photoIndex={photoIndex}
        setPhotoIndex={setPhotoIndex}
        images={allImages}
      />
    </>
  );
};

export default ImageSlider;
