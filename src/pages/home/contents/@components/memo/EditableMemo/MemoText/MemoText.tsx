import { TextareaAutosize } from '@mui/material';

export const MemoText = ({
  message,
  setMessage,
  editable = false,
}: {
  message: string;
  setMessage: (newMessage: string) => void;
  editable?: boolean;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <TextareaAutosize
      className="p-2 mb-1 w-full bg-transparent focus:outline-none resize-none rounded-xl"
      value={message}
      onChange={handleChange}
      readOnly={!editable}
    />
  );
};
