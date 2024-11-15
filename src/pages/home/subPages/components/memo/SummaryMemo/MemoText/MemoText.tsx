import { forwardRef, useEffect, useRef, useState } from 'react';

const MemoText = forwardRef<
  HTMLParagraphElement,
  { message: string; textColor?: string; lines?: number }
>(({ message, textColor = '#111111', lines = 6 }, ref) => {
  const paragraphRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    const element = paragraphRef.current;
    if (element) {
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10);
      const maxHeight = lineHeight * lines;
      if (element.scrollHeight > maxHeight) {
        element.style.height = `${maxHeight}px`;
        element.style.overflow = 'hidden';
        setIsOverflowed(true);
      } else {
        setIsOverflowed(false);
      }
    }
  }, [message]);

  const convertToHyperlinks = (text: string) => {
    console.log(text);
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlPattern,
      '<a id="memo-link" class="underline" href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  };

  return (
    <>
      <div
        ref={(node) => {
          paragraphRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`flex-col h-full bg-transparent focus:outline-none font-regular text-[15px] 
          overflow-hidden text-ellipsis whitespace-break-spaces break-all leading-5`}
        style={{
          color: textColor,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
        }}
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.id === 'memo-link') {
            event.stopPropagation();
          }
        }}
        dangerouslySetInnerHTML={{ __html: convertToHyperlinks(message) }}
      />
      {isOverflowed && <span style={{ color: textColor }}>...</span>}
    </>
  );
});

export default MemoText;
