import { ChangeEvent, useState } from 'react';
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

  const handleModeChange = (newMode: Mode) => {
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

  const handleMicButtonClick = () => {
    // TODO: 음성 인식 기능이 추가되면 코드 작성하기
  };

  const handleCameraButtonClick = () => {
    // TODO: camera OCR 기능이 추가되면 코드 작성하기
  };

  // TODO: 나중에는 서버에서 요청해서 가져올 예정
  const buttonData: [string, string, string, string] = [
    '라면 레시피 메모 보여줘',
    '민지 전화번호 알려줘',
    '맛집 내가 저번에 적은 거 뭐더라',
    '나 신발 사야하는데 사이즈 알려줘',
  ];

  return (
    // FIXME: pt 지금은 그냥 직접 구해서 넣었는데, 나중에 어떻게 하면 저거 자동으로 구할지 상의해보기
    // 50vh - (토글+여백+TextArea 기본 높이) - 사이드바 절반 높이
    <div className="bg-custom-gradient-basic pt-[calc(50vh-120px-140px)] px-4 flex h-full justify-center">
      <div className="max-w-[700px] flex flex-col flex-1 overflow-hidden text-gray2">
        <Component.ModeToggle mode={mode} onModeChange={handleModeChange} />
        <Component.MemoTextAreaWithMicAndCameraButton
          value={message}
          onChange={handleMessageChange}
          placeholder={t('pages.create.inputPlaceholder')}
          onSubmit={() => handleSubmit(message)}
          onMicButtonClick={handleMicButtonClick}
          onCameraButtonClick={handleCameraButtonClick}
        />
        {isSearchMode() && (
          <Component.ExamplesOrResultsAtSearchMode
            status={createSearchNoteManager.status}
            searchAnswer={createSearchNoteManager.searchAnswer}
            navigateToHistory={navigateToHistory}
            buttonData={buttonData}
            handleButtonClick={handleSubmit}
          />
        )}
        {isCreateMode() && <Component.CreatedMemoList memos={memos} />}
      </div>
    </div>
  );
};

export default MainPage;
