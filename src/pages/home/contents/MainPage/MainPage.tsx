import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoTextAreaWithAIButton, SearchConversation } from './components';
import { useCreateSearchNoteManager } from './hook';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { EditableMemo } from '../@components';

const MainPage = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'create' | 'search'>('create');
  const {
    status,
    createAnswer,
    searchAnswer,
    tryCreateMemoAndSetStatus,
    trySearchMemoAndSetStatus,
  } = useCreateSearchNoteManager();
  const chatBotName = t('pages.search.ai.name');
  const chatBotImageUrl = t('pages.search.ai.url');

  // input의 text가 수정 되면, status를 default로 초기화
  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: 'create' | 'search'
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-[561px] flex flex-col flex-1 overflow-hidden text-gray2">
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="mode"
          className="my-4"
        >
          <ToggleButton value="create" aria-label="create">
            create
          </ToggleButton>
          <ToggleButton value="search" aria-label="search">
            search
          </ToggleButton>
        </ToggleButtonGroup>
        <MemoTextAreaWithAIButton
          value={message}
          onChange={handleMessageChange}
          placeholder={t('pages.add.inputPlaceholder')}
          onButtonClick={
            mode === 'create'
              ? () => tryCreateMemoAndSetStatus(message, setMessage)
              : () => trySearchMemoAndSetStatus(message, setMessage)
          }
          isDisabled={status === 'loading'}
          buttonText={
            mode === 'create'
              ? status === 'loading'
                ? t('pages.add.memoCreateButton.loading')
                : t('pages.add.memoCreateButton.default')
              : status === 'loading'
                ? '메모를 검색 중...'
                : '메모 검색하기'
          }
        />
        {status === 'success' && (
          <div className="my-4 p-2 rounded-xl border-[0.12rem]">
            {mode === 'create' && createAnswer && (
              <EditableMemo
                color="transparent"
                key={createAnswer.id}
                memo={createAnswer}
              />
            )}
            {mode === 'search' && searchAnswer && (
              <SearchConversation
                key={searchAnswer.id}
                data={searchAnswer}
                chatBotImageUrl={chatBotImageUrl}
                chatBotName={chatBotName}
              />
            )}
          </div>
        )}

        <div className="flex flex-col flex-1 " />
      </div>
    </div>
  );
};

export default MainPage;
