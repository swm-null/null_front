import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { ArrowForwardIos, ZoomIn, ZoomOut } from '@mui/icons-material';
import 'yet-another-react-lightbox/styles.css';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  photoIndex: number;
  setPhotoIndex: (index: number) => void;
  images: string[];
}

const ImageLightbox = ({
  isOpen,
  onClose,
  photoIndex,
  setPhotoIndex,
  images,
}: ImageLightboxProps) => {
  return (
    <Lightbox
      className="bg-black/30"
      open={isOpen}
      close={onClose}
      index={photoIndex}
      slides={images.map((src) => ({ src }))}
      plugins={[Zoom]}
      carousel={{ finite: true }}
      zoom={{
        maxZoomPixelRatio: 3,
        zoomInMultiplier: 2,
        doubleTapDelay: 300,
        doubleClickDelay: 300,
        doubleClickMaxStops: 2,
        keyboardMoveDistance: 50,
        wheelZoomDistanceFactor: 100,
        pinchZoomDistanceFactor: 100,
        scrollToZoom: true,
      }}
      render={{
        buttonZoom: ({ zoomIn, zoomOut }) => (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
            <button
              onClick={zoomOut}
              className="bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={zoomIn}
              className="bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        ),
        buttonPrev: () =>
          photoIndex > 0 && (
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
              onClick={() => setPhotoIndex(Math.max(0, photoIndex - 1))}
            >
              <ArrowForwardIos className="w-5 h-5 rotate-180" />
            </button>
          ),
        buttonNext: () =>
          photoIndex < images.length - 1 && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
              onClick={() =>
                setPhotoIndex(Math.min(images.length - 1, photoIndex + 1))
              }
            >
              <ArrowForwardIos className="w-5 h-5" />
            </button>
          ),
      }}
    />
  );
};

export default ImageLightbox;
