import Flickity from 'react-flickity-component';

const ImageSlider = ({ image_urls }: { image_urls: string[] | null }) => {
  const flickityOptions = {
    prevNextButtons: false,
    pageDots: image_urls && image_urls.length > 1 ? true : undefined,
    wrapAround: true,
  };

  if (image_urls?.length) {
    return (
      <Flickity
        className="carousel w-60 h-60 min-w-60 rounded-2xl overflow-hidden"
        elementType="div"
        options={flickityOptions}
        static
      >
        {image_urls.map((url, index) => (
          <img
            src={url}
            key={index}
            alt={`Memo Image ${index + 1}`}
            className="carousel-cell object-cover w-full h-full"
          />
        ))}
      </Flickity>
    );
  } else {
    <></>;
  }
};

export default ImageSlider;
