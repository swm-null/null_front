import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import * as Component from './components';
import { Mode, Status } from './interfaces';
import { useCreateMemoManager, useSearchMemoManager } from './hooks';
import { MemoSearchTextArea } from '../components/memo/MemoSearchTextArea';
import { ImageListContext } from 'utils';

const MainPage = ({ navigateToHistory }: { navigateToHistory: () => void }) => {
  const { t } = useTranslation();
  const { addImage } = useContext(ImageListContext);

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
  const { fetchNextPage } = createMemoManager.useMemoStack();

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

  const handleSubmit = (message: string) => {
    if (isCreateMode()) {
      createMemoManager.tryCreateMemoAndSetStatus(message, setMessage);
    } else {
      searchMemoManager.trySearchMemoAndSetStatus(message, setMessage);
    }
  };

  const handleMicButtonClick = () => {
    // TODO: 음성 인식 기능이 추가되면 코드 작성하기
  };

  const handleCameraButtonClick = () => {
    // TODO: camera OCR 기능이 추가되면 코드 작성하기
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
        onSubmit={() => handleSubmit(message)}
        onMicButtonClick={handleMicButtonClick}
        onCameraButtonClick={handleCameraButtonClick}
      />
      <Component.CreatedMemoList
        memos={createMemoManager.useMemoStack().data}
        fetchNextPage={fetchNextPage}
      />
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
    if (isCreateMode() && acceptedFiles.length > 0) {
      acceptedFiles.map((file) => {
        addImage(file);
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    noClick: true,
  });

  return (
    <>
      <input {...getInputProps()} />
      <div
        className="bg-custom-gradient-basic pt-[calc(50vh-120px-140px)] pb-14 px-4 flex h-full justify-center"
        {...getRootProps()}
      >
        <div className="max-w-[740px] flex flex-col flex-1 text-gray3">
          <Component.ModeToggle mode={mode} onModeChange={handleModeChange} />
          <div
            className={`overflow-scroll no-scrollbar p-4 gap-4 flex flex-col`}
          >
            {isCreateMode()
              ? createModeContent
              : isSearchMode() && searchModeContent}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
