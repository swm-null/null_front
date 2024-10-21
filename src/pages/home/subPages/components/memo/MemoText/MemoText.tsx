import { ChangeEvent } from 'react';
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
  setMessage: (newMessage: string) => void;
  handleBlur?: () => void;
  editable?: boolean;
}) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <TextareaAutosize
      className={`w-full bg-transparent focus:outline-none resize-none font-regular text-[15px]`}
      style={{ color: textColor }}
      value={message}
      onChange={handleChange}
      onBlur={handleBlur}
      readOnly={!editable}
    />
  );
};

export default MemoText;
