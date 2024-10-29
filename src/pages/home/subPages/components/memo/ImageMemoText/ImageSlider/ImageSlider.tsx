import { AddIcon } from 'assets/icons';
import { useEffect, useState } from 'react';
import Flickity from 'react-flickity-component';

const ImageSlider = ({
  imageUrls,
  editable = true,
}: {
  imageUrls: string[] | null;
  editable?: boolean;
}) => {
  const [flickityInstance, setFlickityInstance] = useState<Flickity | null>(null);

  useEffect(() => {
    if (flickityInstance) {
      const handleStaticClick = (_: any, __: any, ___: any, cellIndex: number) => {
        if (cellIndex !== undefined) {
          if (cellIndex === imageUrls?.length) {
            alert('이미지 추가 버튼 클릭됨');
          }
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

  if (imageUrls?.length || editable) {
    return (
      <div className="xs:w-60 w-full max-w-72 rounded-2xl overflow-hidden">
        <Flickity
          flickityRef={(instance) => setFlickityInstance(instance)}
          elementType="div"
          className="carousel w-full h-full aspect-square"
          options={flickityOptions}
          static
        >
          {imageUrls?.map((url, index) => (
            <img
              src={url}
              key={index}
              alt={`Memo Image ${index + 1}`}
              className="carousel-cell object-cover w-full h-full xsm:w-60"
            />
          ))}

          {editable && (
            <div className="carousel-cell flex items-center justify-center w-full h-full bg-gray-200 xsm:w-60">
              <AddIcon className="w-10 h-10" />
            </div>
          )}
        </Flickity>
      </div>
    );
  } else {
    return <></>;
  }
};

export default ImageSlider;
