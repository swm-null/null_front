import { FocusEvent, useRef, useState } from 'react';

const MemoText = ({
  message,
  textColor = '#111111',
  setMessage,
  editable = false,
}: {
  message: string;
  textColor?: string;
  setMessage?: (newMessage: string) => void;
  editable?: boolean;
}) => {
  const editableDivRef = useRef<HTMLDivElement>(null);
  const [isBlurred, setIsBlurred] = useState(true);

  const convertToHyperlinks = (text: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlPattern,
      '<a id="memo-link" class="underline cursor-pointer" href="$1" target="_blank">$1</a>'
    );
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!editable) return;

    const cleanText = e.target.innerHTML
      .replace(/<div>/g, '')
      .replace(/<\/div>/g, '\n')
      .replace(/<br>/g, '\n')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>[^<]*<\/a>/g, '$1')
      .replace(/<[^>]*>/g, '')
      .trim();
    setMessage && setMessage(cleanText);
    setIsBlurred(true);
    editableDivRef.current?.blur();
  };

  const handleClick = (event: React.MouseEvent) => {
    if (!editable) return;

    setIsBlurred(false);

    const target = event.target as HTMLAnchorElement;
    if (target.id === 'memo-link') {
      window.open(target.href, '_blank');
      editableDivRef.current?.blur();
    }
  };

  return (
    <div
      ref={editableDivRef}
      className={`w-full bg-transparent font-regular text-[15px] whitespace-break-spaces focus:outline-none
        [&_a]:pointer-events-auto [&_a]:break-all select-text`}
      style={{ color: textColor }}
      contentEditable={editable}
      onClick={handleClick}
      suppressContentEditableWarning
      onBlur={handleBlur}
      dangerouslySetInnerHTML={{
        __html: isBlurred ? convertToHyperlinks(message) : message,
      }}
    />
  );
};

export default MemoText;
