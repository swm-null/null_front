import { ChangeEvent, useEffect, useRef } from 'react';
import { TextareaAutosize } from '@mui/material';

const MemoText = ({
  message,
  textColor = '#111111',
  setMessage,
  handleBlur,
  editable = false,
}: {
  message: string;
  textColor?: string;
  setMessage?: (newMessage: string) => void;
  handleBlur?: () => void;
  editable?: boolean;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage && setMessage(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current && editable) {
      textareaRef.current.focus();
    }
  }, [textareaRef.current]);

  return (
    <div className="flex flex-1 w-full">
      <TextareaAutosize
        ref={textareaRef}
        className={`w-full bg-transparent focus:outline-none resize-none font-regular text-[15px]`}
        style={{ color: textColor }}
        value={message}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly={!editable}
      />
    </div>
  );
};

export default MemoText;
