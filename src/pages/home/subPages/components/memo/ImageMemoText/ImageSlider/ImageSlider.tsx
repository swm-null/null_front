import { AddIcon, CloseIcon } from 'assets/icons';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import Flickity from 'react-flickity-component';
import { ImageListContext } from 'utils';

const ImageSlider = ({
  imageUrls,
  removeImageUrl,
  editable = true,
}: {
  imageUrls: string[];
  removeImageUrl?: (index: number) => void;
  editable?: boolean;
}) => {
  const { images, removeImage, addImage, isValidFileType } =
    useContext(ImageListContext);
  const [flickityInstance, setFlickityInstance] = useState<Flickity | null>(null);

  const isLastImageIndex = (cellIndex: number) =>
    cellIndex === imageUrls?.length + images.length;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        if (isValidFileType(file)) {
          addImage(file);
        }
      });
    }
  };

  const handleAddImageButtonClick = () => {
    const inputFile = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (inputFile) inputFile.click();
  };

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
  }, [flickityInstance, imageUrls, editable]); // flickityInstance를 의존성에 추가

  const flickityOptions = {
    prevNextButtons: false,
    pageDots: imageUrls ? true : undefined,
    setGallerySize: false,
  };

  if ((imageUrls?.length || images.length) && editable) {
    return (
      <div className="xs:w-60 w-full max-w-72 rounded-2xl overflow-hidden">
        <Flickity
          flickityRef={(instance) => setFlickityInstance(instance)}
          elementType="div"
          className="carousel w-full h-full aspect-square"
          options={flickityOptions}
        >
          {imageUrls?.map((url, index) => (
            <div className="carousel-cell w-full h-full xsm:w-60" key={index}>
              <img
                src={url}
                alt={`Memo Image ${index + 1}`}
                className="object-cover w-full h-full xsm:w-60"
              />
              <div
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer"
                onClick={() => {
                  removeImageUrl && removeImageUrl(index);
                }}
              >
                <CloseIcon className="w-4 h-4" />
              </div>
            </div>
          ))}

          {images?.map((image, index) => (
            <div className="carousel-cell w-full h-full xsm:w-60" key={index}>
              <img
                src={URL.createObjectURL(image)}
                alt={`Memo Image ${imageUrls.length + index + 1}`}
                className="object-cover w-full h-full xsm:w-60"
              />
              <div
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer"
                onClick={() => {
                  removeImage(index);
                }}
              >
                <CloseIcon className="w-4 h-4" />
              </div>
            </div>
          ))}

          <form className="carousel-cell flex items-center justify-center w-full h-full bg-gray-200 xsm:w-60">
            <input
              title="input-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <AddIcon className="w-10 h-10" />
          </form>
        </Flickity>
      </div>
    );
  } else {
    return <></>;
  }
};

export default ImageSlider;
