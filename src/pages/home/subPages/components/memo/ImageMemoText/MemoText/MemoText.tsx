import { Divider } from '@mui/material';
import { FocusEvent, useEffect, useRef, useState } from 'react';

const MemoText = ({
  message,
  metadata,
  textColor = '#111111',
  setMessage,
  editable = false,
  placeholder,
}: {
  message: string;
  metadata: string | null;
  textColor?: string;
  setMessage?: (newMessage: string) => void;
  editable?: boolean;
  placeholder?: string;
}) => {
  const editableDivRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const convertToHyperlinks = (text: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlPattern,
      '<a id="memo-link" class="underline cursor-pointer" href="$1" target="_blank">$1</a>'
    );
  };

  const urlPattern = /^https?:\/\/[^\s]+$/;
  const haveOnlyLink = urlPattern.test(message || '');

  const parsedMetadata = metadata ? JSON.parse(metadata) : null;

  const voiceDescriptions = parsedMetadata?.voice_descriptions?.[0] || null;
  const linkDescriptions = parsedMetadata?.link_descriptions?.[0] || null;
  const imageDescriptions = parsedMetadata?.image_descriptions?.[0] || null;

  const descriptions =
    !message && voiceDescriptions
      ? voiceDescriptions.simple_description
      : haveOnlyLink && linkDescriptions
        ? linkDescriptions.simple_description
        : !message && imageDescriptions
          ? imageDescriptions.simple_description
          : null;

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
  };

  const handleFocus = () => {
    console.log('??');
    if (!editable) return;

    setIsEditing(true);
  };

  const handleClickLink = (event: React.MouseEvent) => {
    const target = event.target as HTMLAnchorElement;
    if (target.id === 'memo-link') {
      window.open(target.href, '_blank');
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (isEditing && editableDivRef.current) {
      editableDivRef.current.focus();
    }
  }, [isEditing]);

  return (
    <>
      <div
        className={`w-full text-text-gray2 text-gray2 font-regular ${editable && !isEditing && !message ? 'visible' : 'hidden'}`}
        onClick={handleFocus}
      >
        {placeholder}
      </div>
      <div
        ref={editableDivRef}
        className={`ml-auto bg-transparent font-regular text-[15px] whitespace-break-spaces focus:outline-none
          [&_a]:pointer-events-auto [&_a]:break-all select-text ${isEditing || message ? 'visible' : 'hidden'}`}
        style={{ color: textColor }}
        contentEditable={editable}
        onClick={handleClickLink}
        onBlur={handleBlur}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{
          __html: message.length !== 0 ? convertToHyperlinks(message) : '',
        }}
      />

      {descriptions && (
        <>
          {(editable || message) && <Divider className="pt-2" />}
          <p className={`${message ? 'pt-2' : ''} text-sm text-gray2`}>
            {descriptions}
          </p>
        </>
      )}
    </>
  );
};

export default MemoText;
