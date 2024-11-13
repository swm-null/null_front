import Flickity from 'react-flickity-component';
import { ReactNode, useEffect, useState } from 'react';

interface FlickityWrapperProps {
  children: ReactNode;
  onImageClick: (index: number) => void;
  onRemoveClick: ((index: number) => void) | null;
  onAddClick: (() => void) | null;
  totalImageCount?: number;
  onChange?: (index: number) => void;
  currentIndex?: number;
}

const FlickityWrapper = ({
  children,
  onImageClick,
  onRemoveClick,
  onAddClick,
  totalImageCount = 0,
  onChange,
  currentIndex,
}: FlickityWrapperProps) => {
  const [flickityInstance, setFlickityInstance] = useState<Flickity | null>(null);

  const flickityOptions = {
    prevNextButtons: false,
    pageDots: false,
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

    const handleChange = (index: number) => {
      onChange?.(index);
    };

    flickityInstance.on('staticClick', handleStaticClick);
    flickityInstance.on('change', handleChange);

    return () => {
      flickityInstance.off('staticClick', handleStaticClick);
      flickityInstance.off('change', handleChange);
    };
  }, [flickityInstance, onImageClick, onRemoveClick, onAddClick, totalImageCount]);

  useEffect(() => {
    if (!flickityInstance || currentIndex === undefined) return;
    flickityInstance.select(currentIndex);
  }, [flickityInstance, currentIndex]);

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
