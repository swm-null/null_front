import { ChangeEvent, memo, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import * as Component from './components';
import { Mode, Status } from './interfaces';
import { useCreateMemoManager, useSearchMemoManager } from './hooks';
import { MemoSearchTextArea } from '../components';
import { ImageListContext } from 'utils';

const MainPage = ({ navigateToHistory }: { navigateToHistory: () => void }) => {
  const { t } = useTranslation();
  const { addImage, isValidFileType } = useContext(ImageListContext);

  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<Mode>('create');
  const [status, setStatus] = useState<Status>('default');
  const createMemoManager = useCreateMemoManager({
    status,
    setStatus,
  });
  const searchMemoManager = useSearchMemoManager({
    status,
    setStatus,
  });

  const isCreateMode = () => mode === 'create';
  const isSearchMode = () => mode === 'search';

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleModeChange = (newMode: Mode) => {
    if (newMode !== null) {
      setMode(newMode);
      setMessage('');
    }
  };

  const handleSubmit = (message: string, images?: string[]) => {
    if (isCreateMode()) {
      createMemoManager.tryCreateMemoAndSetStatus(message, setMessage, images);
    } else {
      searchMemoManager.trySearchMemoAndSetStatus(message, setMessage);
    }
  };

  useEffect(() => {
    setStatus('default'); // mode가 변경될 때마다 status를 초기화
  }, [mode]);

  const buttonData: [string, string, string, string] = [
    '라면 레시피 메모 보여줘',
    '민지 전화번호 알려줘',
    '맛집 내가 저번에 적은 거 뭐더라',
    '나 신발 사야하는데 사이즈 알려줘',
  ];

  const createModeContent = (
    <>
      <Component.MemoCreateTextArea
        value={message}
        onChange={handleMessageChange}
        placeholder={t('pages.create.inputPlaceholder')}
        onSubmit={(images: string[]) => handleSubmit(message, images)}
      />
      <div className={`overflow-scroll no-scrollbar`}>
        <Component.CreatedMemoList
          memos={createMemoManager.data}
          fetchNextPage={createMemoManager.fetchNextPage}
        />
      </div>
    </>
  );

  const searchModeContent = (
    <>
      <MemoSearchTextArea
        value={message}
        onChange={handleMessageChange}
        placeholder={t('pages.search.inputPlaceholder')}
        onSubmit={() => handleSubmit(message)}
      />
      <Component.ExamplesOrResultsAtSearchMode
        status={status}
        searchConversation={searchMemoManager.searchConversation}
        navigateToHistory={navigateToHistory}
        buttonData={buttonData}
        handleButtonClick={handleSubmit}
      />
    </>
  );

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
          <Component.ModeToggle mode={mode} onModeChange={handleModeChange} />
          {isCreateMode() ? createModeContent : isSearchMode() && searchModeContent}
        </div>
      </div>
    </>
  );
};

export default memo(MainPage);
