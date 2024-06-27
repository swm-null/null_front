import React from 'react';

export const EditableMemoText = ({ message, setMessage, editable = false }: {
  message: string
  setMessage: (newMessage: string) => void
  editable?: boolean
}) => {
  // focus out될 때, message 저장
  const handleMessageChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    const text = e.target.innerText;
    if (message !== text) {
      setMessage(text);
    }
  }

  return (
    <div className='p-2 mb-2 w-full focus:outline-none resize-none rounded-xl'
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={handleMessageChange}>
      {message}
    </div>
  );
};
