import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomNavContext, ResetContext } from 'utils';
import { MemoCreateTextArea, CreatedMemoList } from './components';
import { MemoEditModal } from '../dashboard/components';
import { useImageList } from '../hooks';
import { useCreateMemoManager } from '../components';
import { useRecentMemoManager } from './hook';

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
  const { isSmallScreen } = useContext(BottomNavContext);
  const { subscribeToReset, unsubscribeFromReset } = useContext(ResetContext);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState('');

  const { handleCreateMemo } = useCreateMemoManager();
  const recentMemoManager = useRecentMemoManager();

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (voice: File | null) => {
    if (message.trim().length === 0 && images.length === 0 && !voice) {
      return;
    }

    handleCreateMemo(message, images, imageUrls, voice);

    setMessage('');
    removeAllImage();
  };

  useEffect(() => {
    const scrollToTop = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    subscribeToReset('', scrollToTop);

    return () => {
      unsubscribeFromReset('', scrollToTop);
    };
  }, []);

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
          ref={scrollContainerRef}
          className={`flex flex-col flex-1 w-full self-center overflow-scroll no-scrollbar ${isSmallScreen ? '' : 'mb-10'}`}
        >
          <div
            className={`max-w-[740px] w-full self-center ${isSmallScreen ? '' : 'mx-20'}`}
          >
            <CreatedMemoList
              memos={recentMemoManager.data}
              fetchNextPage={recentMemoManager.fetchNextPage}
            />
          </div>
        </div>
      </div>
      <MemoEditModal />
    </>
  );
};

export default CreatePage;
