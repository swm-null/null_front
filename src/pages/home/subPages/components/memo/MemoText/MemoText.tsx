import { ChangeEvent } from 'react';
import { TextareaAutosize } from '@mui/material';

const MemoText = ({
  message,
  setMessage,
  handleBlur,
  editable = false,
}: {
  message: string;
  setMessage: (newMessage: string) => void;
  handleBlur?: () => void;
  editable?: boolean;
}) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <TextareaAutosize
      className="w-full bg-transparent focus:outline-none resize-none text-[#111111] font-medium"
      value={message}
      onChange={handleChange}
      onBlur={handleBlur}
      readOnly={!editable}
    />
  );
};

export default MemoText;
