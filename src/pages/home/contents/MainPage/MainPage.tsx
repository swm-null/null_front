import { ChangeEvent, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoTextAreaWithAIButton, ModeToggle } from './components';
import { useCreateSearchNoteManager } from './hook';
import { SearchConversation } from 'pages/home/contents/_components';
import { Mode } from 'pages/home/contents/_interfaces';
import { oatmealUrl } from 'assets/images';
import { CreateMemoAnswer } from './components/CreateMemoAnswer';
import { HistoryIcon } from 'assets/icons';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import ExampleBox from './components/ExampleBox/ExampleBox';

const MainPage = ({ navigateToHistory }: { navigateToHistory: () => void }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<Mode>('search');
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
    if (mode === 'create') {
      createSearchNoteManager.tryCreateMemoAndSetStatus(message, setMessage);
    } else {
      createSearchNoteManager.trySearchMemoAndSetStatus(message, setMessage);
    }
  };

  const buttonData = [
    t('pages.main.example1'),
    t('pages.main.example2'),
    t('pages.main.example3'),
    t('pages.main.example4'),
  ];

  const renderExampleContentByMode = () => (
    <div className="flex justify-center items-center mt-4">
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 4 }}
        className="w-full"
      >
        <Masonry gutter="10px">
          {buttonData.map((text, _) => (
            <ExampleBox text={text} onClick={() => handleButtonClick(text)} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );

  const renderResultContentByMode = () => {
    return (
      <div className="mt-4 px-2 pt-3 pb-4 max-h-[70%] w-full rounded-xl border-[0.12rem] mr-3">
        <div className="box-border h-full overflow-auto no-scrollbar">
          {mode === 'create' && createSearchNoteManager.createAnswer ? (
            <CreateMemoAnswer
              color="transparent"
              key={createSearchNoteManager.createAnswer.id}
              memo={createSearchNoteManager.createAnswer}
            />
          ) : mode === 'search' && createSearchNoteManager.searchAnswer ? (
            <SearchConversation
              key={createSearchNoteManager.searchAnswer.id}
              data={createSearchNoteManager.searchAnswer}
              chatBotImageUrl={oatmealUrl}
              chatBotName={t('pages.search.ai.name')}
            />
          ) : null}
        </div>
        {mode === 'search' && createSearchNoteManager.searchAnswer ? (
          <div
            className="flex gap-2 items-center justify-end mt-5 cursor-pointer"
            onClick={navigateToHistory}
          >
            <HistoryIcon />
            <p>{t('pages.main.history')}</p>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="py-16 px-4 flex h-full justify-center">
      <div className="max-w-[700px] flex flex-col flex-1 overflow-hidden text-gray2">
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
