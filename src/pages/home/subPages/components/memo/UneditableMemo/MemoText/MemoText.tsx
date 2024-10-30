import { forwardRef, useEffect, useState } from 'react';

const MemoText = forwardRef<
  HTMLParagraphElement,
  { message: string; textColor?: string }
>(({ message, textColor = '#111111' }, ref) => {
  const [maxLines, setMaxLines] = useState(0);

  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      const lineHeight = parseFloat(getComputedStyle(ref.current).lineHeight);
      const maxHeight = parseFloat(getComputedStyle(ref.current).height);
      const calculatedMaxLines = Math.floor(maxHeight / lineHeight);

      setMaxLines(calculatedMaxLines);
    }
  }, [ref && 'current' in ref && ref.current, message]);

  return (
    <p
      ref={ref}
      className={`flex flex-1 bg-transparent focus:outline-none font-regular text-[15px] 
            overflow-hidden whitespace-break-spaces text-ellipsis`}
      style={{
        color: textColor,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        WebkitLineClamp: maxLines,
      }}
    >
      {message}
    </p>
  );
});

export default MemoText;
