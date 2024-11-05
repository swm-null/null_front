import Flickity from 'react-flickity-component';
import { ReactNode, useEffect, useState } from 'react';

interface FlickityWrapperProps {
  children: ReactNode;
  showPageDots?: boolean;
  onImageClick: (index: number) => void;
  onRemoveClick: ((index: number) => void) | null;
  onAddClick: (() => void) | null;
  totalImageCount?: number;
}

const FlickityWrapper = ({
  children,
  showPageDots = false,
  onImageClick,
  onRemoveClick,
  onAddClick,
  totalImageCount = 0,
}: FlickityWrapperProps) => {
  const [flickityInstance, setFlickityInstance] = useState<Flickity | null>(null);

  const flickityOptions = {
    prevNextButtons: false,
    pageDots: showPageDots,
    setGallerySize: false,
  };

  useEffect(() => {
    if (!flickityInstance) return;

    const handleStaticClick = (event: any, _: any, __: any, cellIndex: number) => {
      const removeButton = (event.target as HTMLElement).closest('.remove-button');
      if (removeButton instanceof HTMLElement) {
        onRemoveClick?.(cellIndex);
        event.preventDefault();
        return;
      }

      if (cellIndex === totalImageCount && onAddClick) {
        onAddClick();
      } else {
        onImageClick?.(cellIndex);
      }
    };

    flickityInstance.on('staticClick', handleStaticClick);
    return () => {
      flickityInstance.off('staticClick', handleStaticClick);
    };
  }, [flickityInstance, onImageClick, onRemoveClick, onAddClick, totalImageCount]);

  return (
    <Flickity
      elementType="div"
      flickityRef={(instance) => setFlickityInstance(instance)}
      className="carousel w-full h-full aspect-square"
      options={flickityOptions}
    >
      {children}
    </Flickity>
  );
};

export default FlickityWrapper;
