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
  if (!searchAnswer) return;

  return (
    <>
      <div className="mt-5 mr-3 px-2 py-6 max-h-[70%] w-full rounded-xl border-[0.12rem] bg-[#FFF6E3CC]">
        <SearchConversation
          key={searchAnswer.id}
          data={searchAnswer}
          chatBotImageUrl={oatmealUrl}
          chatBotName={t('pages.search.ai.name')}
        />
      </div>
      <HistoryButton
        onClick={navigateToHistory}
        text={t('pages.main.searchHistory')}
      />
    </>
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
    className="flex gap-2 mt-2 items-center justify-end cursor-pointer"
    onClick={onClick}
  >
    <HistoryIcon />
    <p>{text}</p>
  </div>
);

export default ResultContent;
