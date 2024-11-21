import { Divider } from '@mui/material';
import { FocusEvent, useEffect, useRef, useState } from 'react';

const MemoText = ({
  message,
  metadata,
  textColor = '#111111',
  setMessage,
  editable = false,
  placeholder,
  onPaste,
}: {
  message: string;
  metadata: string | null;
  textColor?: string;
  setMessage?: (newMessage: string) => void;
  editable?: boolean;
  placeholder?: string;
  onPaste: (e: React.ClipboardEvent) => void;
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

  const descriptions = voiceDescriptions
    ? voiceDescriptions.simple_description
    : haveOnlyLink && linkDescriptions
      ? linkDescriptions.simple_description
      : imageDescriptions
        ? imageDescriptions.simple_description
        : null;

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!editable) return;

    setIsEditing(false);

    const cleanText = e.target.innerHTML
      .replace(/<div>/g, '')
      .replace(/<\/div>/g, '\n')
      .replace(/<br>/g, '\n')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>[^<]*<\/a>/g, '$1')
      .replace(/<[^>]*>/g, '')
      .trim();

    setMessage && setMessage(cleanText);
  };

  const handleClickLink = (event: React.MouseEvent) => {
    setIsEditing(true);

    const target = event.target as HTMLAnchorElement;

    if (target.id === 'memo-link') {
      window.open(target.href, '_blank');
      event.preventDefault();
    }
  };

  const handleFocus = () => {
    if (!editable) return;
    setIsEditing(true);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;

    onPaste(e);

    const text = clipboardData.getData('text/plain');
    if (editableDivRef.current && text) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
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
        className={`w-full h-full text-gray2 font-regular ${
          editable && !isEditing && !message ? 'visible' : 'hidden'
        }`}
        onClick={handleFocus}
      >
        {placeholder}
      </div>
      <div
        ref={editableDivRef}
        className={`ml-auto bg-transparent font-regular 
          ${!isEditing && !message ? 'hidden' : 'visible'} ${editable ? 'h-full' : ''} 
          text-[15px] whitespace-break-spaces break-all focus:outline-none`}
        style={{ color: textColor }}
        contentEditable={editable}
        onClick={handleClickLink}
        onPaste={handlePaste}
        onBlur={handleBlur}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{
          __html:
            message.length !== 0
              ? isEditing
                ? message
                : convertToHyperlinks(message)
              : '',
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
