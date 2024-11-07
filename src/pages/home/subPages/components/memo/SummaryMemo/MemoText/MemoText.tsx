import { forwardRef, useEffect, useRef, useState } from 'react';

const MemoText = forwardRef<
  HTMLParagraphElement,
  { message: string; textColor?: string }
>(({ message, textColor = '#111111' }, ref) => {
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    const element = paragraphRef.current;
    if (element) {
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10);
      const maxHeight = lineHeight * 6;
      if (element.scrollHeight > maxHeight) {
        element.style.height = `${maxHeight}px`;
        element.style.overflow = 'hidden';
        setIsOverflowed(true);
      } else {
        setIsOverflowed(false);
      }
    }
  }, [message]);

  return (
    <>
      <p
        ref={(node) => {
          paragraphRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`flex-col h-full bg-transparent focus:outline-none font-regular text-[15px] 
          overflow-hidden text-ellipsis whitespace-break-spaces leading-5`}
        style={{
          color: textColor,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
        }}
      >
        {message}
      </p>
      {isOverflowed && <span className="text-gray2">...</span>}
    </>
  );
});

export default MemoText;
