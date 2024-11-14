import { ChangeEvent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateMemoManager } from './hook';
import { RecordingContext } from 'utils';
import { MemoCreateTextArea, CreatedMemoList } from './components';
import { MemoEditModal } from '../dashboard/components';
import { useImageList } from '../hooks';

const CreatePage = () => {
  const { t } = useTranslation();
  const { images, imageUrls, getInputProps, getRootProps, removeAllImage } =
    useImageList();
  const { audioBlobs, removeAudio } = useContext(RecordingContext);

  const [message, setMessage] = useState('');
  const createMemoManager = useCreateMemoManager();

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (
      message.trim().length === 0 &&
      images.length === 0 &&
      audioBlobs.length === 0
    ) {
      return;
    }

    createMemoManager.handleCreateMemo(message, images, imageUrls, audioBlobs);

    setMessage('');
    removeAllImage();
    removeAudio();
  };

  return (
    <>
      <input {...getInputProps()} />
      <div
        className="flex justify-center overflow-hidden h-full"
        {...getRootProps()}
      >
        <div className="w-full max-w-[740px] h-full flex flex-col flex-1 text-gray3">
          <div className={`overflow-scroll no-scrollbar`}>
            <MemoCreateTextArea
              value={message}
              onChange={handleMessageChange}
              placeholder={t('pages.create.inputPlaceholder')}
              onSubmit={handleSubmit}
            />
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
