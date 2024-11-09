import {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TextareaAutosize } from '@mui/material';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isBlurred, setIsBlurred] = useState(true);

  const convertToHyperlinks = (text: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlPattern,
      '<a class="underline" href="$1" target="_blank">$1</a>'
    );
  };

  const handleFocus = useCallback(() => {
    if (textareaRef.current) {
      setIsBlurred(true);
    }
  }, [textareaRef.current]);

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    e.target.blur();
    setIsBlurred(false);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage && setMessage(e.target.value);
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, [isBlurred]);

  return (
    <div className="flex flex-1 w-full">
      <TextareaAutosize
        ref={textareaRef}
        className={`w-full bg-transparent focus:outline-none resize-none font-regular text-[15px] ${isBlurred && editable ? '' : 'hidden'}`}
        style={{ color: textColor }}
        value={message}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <div
        className={`w-full bg-transparent font-regular text-[15px] whitespace-break-spaces 
          [&_a]:pointer-events-auto [&_a]:break-all ${!isBlurred || !editable ? '' : 'hidden'}`}
        style={{ color: textColor }}
        dangerouslySetInnerHTML={{ __html: convertToHyperlinks(message) }}
        onClick={handleFocus}
      />
    </div>
  );
};

export default MemoText;
