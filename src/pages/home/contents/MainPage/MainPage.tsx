import { ChangeEvent, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Component from './components';
import { Mode } from 'pages/home/contents/_interfaces';
import { useCreateSearchNoteManager } from './hook';

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

  const handleButtonClick = (message: string) => {
    if (isCreateMode()) {
      createSearchNoteManager.tryCreateMemoAndSetStatus(message, setMessage);
    } else {
      createSearchNoteManager.trySearchMemoAndSetStatus(message, setMessage);
    }
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
        <Component.MemoTextAreaWithAIButton
          value={message}
          onChange={handleMessageChange}
          placeholder={t('pages.add.inputPlaceholder')}
          onButtonClick={() => handleButtonClick(message)}
        />
        {createSearchNoteManager.status === 'default' && isSearchMode() && (
          <Component.ExampleContents
            buttonData={buttonData}
            handleButtonClick={handleButtonClick}
          />
        )}
        {createSearchNoteManager.status === 'success' && (
          <Component.ResultContent
            createAnswer={createSearchNoteManager.createAnswer}
            searchAnswer={createSearchNoteManager.searchAnswer}
            status={createSearchNoteManager.status}
            isSearchMode={isSearchMode()}
            navigateToHistory={navigateToHistory}
          />
        )}
      </div>
    </div>
  );
};

export default MainPage;
