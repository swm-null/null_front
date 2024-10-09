import { CircularProgress } from '@mui/material';
import { BookIcon } from 'assets/icons';
import { MemosList, UneditableMemo } from 'pages/home/subPages/components';
import {
  MemoSearchAnswer,
  MemoSearchConversation,
} from 'pages/home/subPages/interfaces';

const SearchConversation = ({
  data,
  chatBotName,
}: {
  data: MemoSearchConversation;
  chatBotName: string;
}) => {
  return (
    <div key={data.id} className="px-6 h-full">
      <div className="flex items-start gap-4">
        <AIInfo name={chatBotName} />
        <UserQuestion contentText={data.query} />
      </div>
      <AIAnswer content={data.answer} />
    </div>
  );
};

const AIInfo = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-shrink-0 items-center">
      <BookIcon />
      <p className="ml-2 text-lg font-semibold">{name}</p>
    </div>
  );
};

const UserQuestion = ({ contentText }: { contentText: string }) => {
  return (
    <div
      className="inline-block self-end bg-[#FFE5C1] rounded-xl rounded-br-none py-2 px-4 
        overflow-hidden max-w-3/4 border-[1px] border-black border-opacity-10 bg-clip-padding ml-auto"
    >
      <p className="inline text-right whitespace-pre-line break-words">
        {contentText}
      </p>
    </div>
  );
};

const AIAnswer = ({ content }: { content: MemoSearchAnswer | null }) => {
  return (
    <div className="mt-[18px]">
      {content ? (
        <>
          <div className="inline bg-transparent resize-none whitespace-pre-wrap break-words">
            {content.text}
          </div>
          <div className="flex flex-col w-full">
            {content.memos && (
              <div className="mt-[6px] text-center max-h-60 overflow-y-auto no-scrollbar">
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
        </>
      ) : (
        <div className="flex gap-3 text-sm">
          <CircularProgress className="self-center" size={15} />
          <p className="text-gray3 font-regular text-[11px]">
            답변을 생성중입니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchConversation;
