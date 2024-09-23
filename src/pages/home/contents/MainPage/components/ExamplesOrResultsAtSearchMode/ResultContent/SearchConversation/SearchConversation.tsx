import { BookIcon } from 'assets/icons';
import { MemosList, UneditableMemo } from 'pages/home/contents/_components';
import {
  MemoSearchAnswer,
  MemoSearchConversation,
} from 'pages/home/contents/_interfaces';

const SearchConversation = ({
  data,
  chatBotName,
  chatBotImageUrl,
}: {
  data: MemoSearchConversation;
  chatBotName: string;
  chatBotImageUrl: string;
}) => {
  return (
    <div key={data.id} className="px-6 h-full">
      <UserQuestionAndAIHeader
        contentText={data.query}
        name={chatBotName}
        imageUrl={chatBotImageUrl}
      />
      <AIAnswer content={data.answer} />
    </div>
  );
};

const UserQuestionAndAIHeader = ({
  contentText,
  name,
}: {
  contentText: string;
  name: string;
  imageUrl: string;
}) => {
  return (
    <div className="flex items-end">
      <div className="flex items-center">
        <BookIcon />
        <p className="ml-2 text-lg font-semibold">{name}</p>
      </div>
      <div className="flex flex-1" />
      <div
        className="inline-block self-end bg-[#FFE5C1] rounded-xl rounded-br-none py-2 px-4 
        overflow-hidden max-w-3/4 border-[1px] border-[#F2DAB7]"
      >
        <p className="inline text-right whitespace-pre-line break-words">
          {contentText}
        </p>
      </div>
    </div>
  );
};

const AIAnswer = ({ content }: { content: MemoSearchAnswer }) => {
  return (
    <div className="mt-[18px]">
      <div className="inline bg-transparent resize-none whitespace-pre-wrap break-words">
        {content.text}
      </div>
      <div className="flex flex-col w-full">
        {content.memos && (
          <div className="mt-[6px] px-8 text-center max-h-60 overflow-y-auto no-scrollbar">
            <MemosList>
              {content.memos?.map((memo) => (
                <div key={memo.id} className="inline rounded-lg min-w-72">
                  <UneditableMemo memo={memo} />
                </div>
              ))}
            </MemosList>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchConversation;
