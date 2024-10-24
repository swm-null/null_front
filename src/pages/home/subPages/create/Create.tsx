import { ChangeEvent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { useCreateMemoManager } from './hook';
import { ImageListContext } from 'utils';
import { MemoCreateTextArea, CreatedMemoList } from './components';

const CreatePage = () => {
  const { t } = useTranslation();
  const { addImage, isValidFileType } = useContext(ImageListContext);

  const [message, setMessage] = useState('');
  const createMemoManager = useCreateMemoManager();

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (message: string, images?: string[]) => {
    createMemoManager.tryCreateMemoAndSetStatus(message, setMessage, images);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(isValidFileType);
    if (validFiles.length > 0) {
      validFiles.forEach((file) => {
        addImage(file);
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <>
      <input {...getInputProps()} />
      <div
        className="flex justify-center overflow-hidden h-full"
        {...getRootProps()}
      >
        <div className="max-w-[740px] h-full flex flex-col flex-1 text-gray3">
          <MemoCreateTextArea
            value={message}
            onChange={handleMessageChange}
            placeholder={t('pages.create.inputPlaceholder')}
            onSubmit={(images: string[]) => handleSubmit(message, images)}
          />
          <div className={`overflow-scroll no-scrollbar`}>
            <CreatedMemoList
              memos={createMemoManager.data}
              fetchNextPage={createMemoManager.fetchNextPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePage;
