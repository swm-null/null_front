import { ChangeEvent, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoTextAreaWithAIButton, ModeToggle } from './components';
import { useCreateSearchNoteManager } from './hook';
import { SearchConversation } from 'pages/home/contents/_components';
import { Mode } from 'pages/home/contents/_interfaces';
import { oatmealUrl } from 'assets/images';
import { CreateMemoAnswer } from './components/CreateMemoAnswer';

const MainPage = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<Mode>('create');
  const {
    status,
    createAnswer,
    searchAnswer,
    tryCreateMemoAndSetStatus,
    trySearchMemoAndSetStatus,
  } = useCreateSearchNoteManager(mode);

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleModeChange = (_: MouseEvent<HTMLElement>, newMode: Mode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleButtonClick = (message: string) => {
    if (mode === 'create') {
      tryCreateMemoAndSetStatus(message, setMessage);
    } else {
      trySearchMemoAndSetStatus(message, setMessage);
    }
  };

  const renderExampleContentByMode = () => {
    return (
      <div className="flex justify-center items-center mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div
            className="flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 min-h-24"
            onClick={() => handleButtonClick('라면 레시피 메모 보여줘')}
          >
            라면 레시피 메모 보여줘
          </div>
          <div
            className="flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 min-h-24"
            onClick={() => handleButtonClick('민지 전화번호 알려줘')}
          >
            민지 전화번호 알려줘
          </div>
          <div
            className="flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 min-h-24"
            onClick={() => handleButtonClick('맛집 내가 저번에 적은 거 뭐더라')}
          >
            맛집 내가 저번에 적은 거 뭐더라
          </div>
          <div
            className="flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 min-h-24"
            onClick={() =>
              handleButtonClick('나 신발 사야하는데 사이즈 알려줘')
            }
          >
            나 신발 사야하는데 사이즈 알려줘
          </div>
        </div>
      </div>
    );
  };

  const renderResultContentByMode = () => {
    return (
      <div className="mt-4 px-2 pt-3 pb-4 max-h-[70%] w-full rounded-xl border-[0.12rem] mr-3">
        <div className="box-border h-full overflow-auto">
          {/* 여기에서 overflow-hidden을 overflow-auto로 변경 */}
          {mode === 'create' && createAnswer ? (
            <CreateMemoAnswer
              color="transparent"
              key={createAnswer.id}
              memo={createAnswer}
            />
          ) : mode === 'search' && searchAnswer ? (
            <SearchConversation
              key={searchAnswer.id}
              data={searchAnswer}
              chatBotImageUrl={oatmealUrl}
              chatBotName={t('pages.search.ai.name')}
            />
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full justify-center pb-4">
      <div className="max-w-[60%] flex flex-col flex-1 overflow-hidden text-gray2">
        <ModeToggle mode={mode} onModeChange={handleModeChange} />
        <MemoTextAreaWithAIButton
          value={message}
          onChange={handleMessageChange}
          placeholder={t('pages.add.inputPlaceholder')}
          onButtonClick={() => handleButtonClick(message)}
        />
        {status === 'default' &&
          mode === 'search' &&
          renderExampleContentByMode()}
        {status === 'success' && renderResultContentByMode()}
      </div>
    </div>
  );
};

export default MainPage;
