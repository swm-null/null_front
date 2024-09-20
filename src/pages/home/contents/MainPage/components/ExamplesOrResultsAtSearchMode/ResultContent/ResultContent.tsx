import { SearchConversation } from 'pages/home/contents/_components';
import { oatmealUrl } from 'assets/images';
import { HistoryIcon } from 'assets/icons';
import { useTranslation } from 'react-i18next';
import { MemoSearchConversation } from 'pages/home/contents/_interfaces';

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
    <div className="mt-4 px-2 pt-3 pb-4 max-h-[70%] w-full rounded-xl border-[0.12rem] mr-3">
      {searchAnswer ? (
        <>
          <div className="box-border h-full overflow-auto no-scrollbar">
            <SearchConversation
              key={searchAnswer.id}
              data={searchAnswer}
              chatBotImageUrl={oatmealUrl}
              chatBotName={t('pages.search.ai.name')}
            />
          </div>
          <div
            className="flex gap-2 items-center justify-end mt-5 cursor-pointer"
            onClick={navigateToHistory}
          >
            <HistoryIcon />
            <p>{t('pages.main.history')}</p>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ResultContent;
