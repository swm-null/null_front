import { HistoryIcon } from 'assets/icons';
import { useTranslation } from 'react-i18next';
import { MemoSearchConversation } from 'pages/home/subPages/interfaces';
import { SearchConversation } from './SearchConversation';

interface ResultContentProps {
  searchConversation?: MemoSearchConversation;
  navigateToHistory: () => void;
}

const ResultContent = ({
  searchConversation,
  navigateToHistory,
}: ResultContentProps) => {
  const { t } = useTranslation();
  if (!searchConversation) return;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="px-2 py-6 w-full flex-1 rounded-xl border-[1px] overflow-scroll
          border-black border-opacity-10 bg-clip-padding bg-[#FFF6E3CC] font-regular"
      >
        <SearchConversation
          key={searchConversation.id}
          data={searchConversation}
          chatBotName={t('pages.search.ai.name')}
        />
      </div>
      <HistoryButton
        onClick={navigateToHistory}
        text={t('pages.main.searchHistory')}
      />
    </div>
  );
};

const HistoryButton = ({ onClick, text }: { onClick: () => void; text: string }) => (
  <div
    className="flex gap-2 mt-2 items-center justify-end cursor-pointer"
    onClick={onClick}
  >
    <HistoryIcon />
    <p className="text-[#6A5344]">{text}</p>
  </div>
);

export default ResultContent;
