import { ChangeEvent, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Component from './components';
import { Mode } from 'pages/home/contents/_interfaces';
import { useCreateSearchNoteManager } from './hook';
import { memos } from './test/dummyData';

const MainPage = ({ navigateToHistory }: { navigateToHistory: () => void }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<Mode>('search');
  const isCreateMode = () => mode === 'create';
  const isSearchMode = () => mode === 'search';

  const createSearchNoteManager = useCreateSearchNoteManager(mode);

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleModeChange = (_: MouseEvent<HTMLElement>, newMode: Mode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleSubmit = (message: string) => {
    if (isCreateMode()) {
      createSearchNoteManager.tryCreateMemoAndSetStatus(message, setMessage);
    } else {
      createSearchNoteManager.trySearchMemoAndSetStatus(message, setMessage);
    }
  };

  const handleMikeButtonClick = () => {
    // TODO: 음성 인식 기능이 추가되면 코드 작성하기
  };

  const handleCameraButtonClick = () => {
    // TODO: camera OCR 기능이 추가되면 코드 작성하기
  };

  // TODO: 나중에는 서버에서 요청해서 가져올 예정
  const buttonData = [
    '라면 레시피 메모 보여줘',
    '민지 전화번호 알려줘',
    '맛집 내가 저번에 적은 거 뭐더라',
    '나 신발 사야하는데 사이즈 알려줘',
  ];

  return (
    <div className="py-16 px-4 flex h-full justify-center">
      <div className="max-w-[700px] flex flex-col flex-1 overflow-hidden text-gray2">
        <Component.ModeToggle mode={mode} onModeChange={handleModeChange} />
        <Component.MemoTextAreaWithMikeAndCameraButton
          value={message}
          onChange={handleMessageChange}
          placeholder={t('pages.add.inputPlaceholder')}
          onSubmit={() => handleSubmit(message)}
          onMikeButtonClick={handleMikeButtonClick}
          onCameraButtonClick={handleCameraButtonClick}
        />
        {isSearchMode() && (
          <Component.SearchMemoContents
            status={createSearchNoteManager.status}
            searchAnswer={createSearchNoteManager.searchAnswer}
            navigateToHistory={navigateToHistory}
            buttonData={buttonData}
            handleButtonClick={handleSubmit}
          />
        )}
        {isCreateMode() && <Component.CreateMemoContents memos={memos} />}
      </div>
    </div>
  );
};

export default MainPage;
