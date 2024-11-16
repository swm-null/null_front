import { ChangeEvent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateMemoManager } from './hook';
import { BottomNavContext, RecordingContext } from 'utils';
import { MemoCreateTextArea, CreatedMemoList } from './components';
import { MemoEditModal } from '../dashboard/components';
import { useImageList } from '../hooks';

const CreatePage = () => {
  const { t } = useTranslation();
  const {
    images,
    imageUrls,
    getInputProps,
    getRootProps,
    removeImage,
    removeAllImage,
    handleImageFilesChange,
    handlePaste,
  } = useImageList();
  const { removeAudio } = useContext(RecordingContext);
  const { isSmallScreen } = useContext(BottomNavContext);

  const [message, setMessage] = useState('');
  const createMemoManager = useCreateMemoManager();

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (audioBlob: Blob | null) => {
    if (message.trim().length === 0 && images.length === 0 && !audioBlob) {
      return;
    }

    createMemoManager.handleCreateMemo(message, images, imageUrls, audioBlob);

    setMessage('');
    removeAllImage();
    removeAudio();
  };

  return (
    <>
      <input {...getInputProps()} />
      <div
        className="flex flex-col justify-center overflow-hidden h-full"
        {...getRootProps()}
      >
        <div className="flex flex-col max-w-[740px] w-full self-center">
          <MemoCreateTextArea
            value={message}
            placeholder={t('pages.create.inputPlaceholder')}
            imageUrls={imageUrls}
            onImageFilesChange={handleImageFilesChange}
            onPaste={handlePaste}
            onChange={handleMessageChange}
            onSubmit={handleSubmit}
            removeImage={removeImage}
          />
        </div>
        <div
          className={`flex flex-col flex-1 w-full self-center overflow-scroll no-scrollbar ${isSmallScreen ? '' : 'mb-10'}`}
        >
          <div
            className={`max-w-[740px] w-full self-center ${isSmallScreen ? '' : 'mx-20'}`}
          >
            <CreatedMemoList
              memos={createMemoManager.data}
              fetchNextPage={createMemoManager.fetchNextPage}
            />
          </div>
        </div>
      </div>
      <MemoEditModal />
    </>
  );
};

export default CreatePage;
