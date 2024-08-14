import { ChangeEvent, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoTextAreaWithAIButton, ModeToggle } from './components';
import { useCreateSearchNoteManager } from './hook';
import {
  EditableMemo,
  SearchConversation,
} from 'pages/home/contents/_components';
import { Mode } from 'pages/home/contents/_interfaces';

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

  const handleButtonClick = () => {
    return mode === 'create'
      ? () => tryCreateMemoAndSetStatus(message, setMessage)
      : () => trySearchMemoAndSetStatus(message, setMessage);
  };

  const getButtonText = () => {
    if (status === 'loading') {
      return mode === 'create'
        ? t('pages.add.memoCreateButton.loading')
        : t('pages.search.memoSearchButton.loading');
    }
    return mode === 'create'
      ? t('pages.add.memoCreateButton.default')
      : t('pages.search.memoSearchButton.default');
  };

  const renderResultContentByMode = () => {
    return (
      <div className="my-4 p-2 rounded-xl border-[0.12rem]">
        {mode === 'create' && createAnswer ? (
          <EditableMemo
            color="transparent"
            key={createAnswer.id}
            memo={createAnswer}
          />
        ) : mode === 'search' && searchAnswer ? (
          <SearchConversation
            key={searchAnswer.id}
            data={searchAnswer}
            chatBotImageUrl={t('pages.search.ai.url')}
            chatBotName={t('pages.search.ai.name')}
          />
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex h-full justify-center pb-4">
      <div className="max-w-[561px] flex flex-col flex-1 overflow-hidden text-gray2">
        <ModeToggle mode={mode} onModeChange={handleModeChange} />
        <MemoTextAreaWithAIButton
          value={message}
          onChange={handleMessageChange}
          placeholder={t('pages.add.inputPlaceholder')}
          onButtonClick={handleButtonClick()}
          isDisabled={status === 'loading'}
          buttonText={getButtonText()}
        />
        {status === 'success' && renderResultContentByMode()}
      </div>
    </div>
  );
};

export default MainPage;
