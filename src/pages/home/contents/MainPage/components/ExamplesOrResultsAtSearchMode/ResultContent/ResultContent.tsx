import { oatmealUrl } from 'assets/images';
import { HistoryIcon } from 'assets/icons';
import { useTranslation } from 'react-i18next';
import { MemoSearchConversation } from 'pages/home/contents/_interfaces';
import { SearchConversation } from './SearchConversation';

interface ResultContentProps {
  searchAnswer?: MemoSearchConversation;
  navigateToHistory: () => void;
}

const ResultContent = ({
  searchAnswer,
  navigateToHistory,
}: ResultContentProps) => {
  const { t } = useTranslation();

  return (
    <div className="mt-6 mr-3 px-2 pb-4 max-h-[70%] w-full rounded-xl border-[0.12rem]  bg-[#FFF6E3CC] text-[#111111]">
      {searchAnswer && (
        <>
          <SearchConversation
            key={searchAnswer.id}
            data={searchAnswer}
            chatBotImageUrl={oatmealUrl}
            chatBotName={t('pages.search.ai.name')}
          />
          <HistoryButton
            onClick={navigateToHistory}
            text={t('pages.main.searchHistory')}
          />
        </>
      )}
    </div>
  );
};

const HistoryButton = ({
  onClick,
  text,
}: {
  onClick: () => void;
  text: string;
}) => (
  <div
    className="flex gap-2 items-center justify-end cursor-pointer"
    onClick={onClick}
  >
    <HistoryIcon />
    <p>{text}</p>
  </div>
);

export default ResultContent;
