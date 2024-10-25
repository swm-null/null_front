import Flickity from 'react-flickity-component';

const ImageSlider = ({
  image_urls,
}: {
  image_urls: string[] | null;
  // FIXME: 이미지 편집 가능하게 나중에 추가
  editable?: boolean;
}) => {
  const flickityOptions = {
    prevNextButtons: false,
    pageDots: image_urls && image_urls.length > 1 ? true : undefined,
    wrapAround: true,
    setGallerySize: false,
  };

  if (image_urls?.length) {
    return (
      <Flickity
        className="carousel xs:w-60 w-full max-w-72 rounded-2xl overflow-hidden aspect-square"
        elementType="div"
        options={flickityOptions}
        static
      >
        {image_urls.map((url, index) => (
          <img
            src={url}
            key={index}
            alt={`Memo Image ${index + 1}`}
            className="carousel-cell object-cover w-full h-full xsm:w-60"
          />
        ))}
      </Flickity>
    );
  } else {
    <></>;
  }
};

export default ImageSlider;
