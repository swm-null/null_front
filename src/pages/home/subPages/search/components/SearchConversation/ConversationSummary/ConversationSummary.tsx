import { DownIcon } from 'assets/icons';

import { MemoSearchConversation } from 'pages/home/subPages/interfaces';

const ConversationSummary = ({
  isOpen,
  data,
  formatDate,
}: {
  isOpen: boolean;
  data: MemoSearchConversation;
  formatDate: (date: string) => string;
}) => {
  return (
    <div className="px-5 py-4 flex justify-start cursor-pointer gap-[0.87rem]">
      <DownIcon
        className="text-brown1 flex-shrink-0 transition-transform duration-300"
        style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
      {isOpen ? (
        <div className="flex items-start gap-4 flex-1">
          <UserQuestion contentText={data.query} />
        </div>
      ) : (
        <p className="text-base font-semibold text-brown2 overflow-hidden whitespace-nowrap text-ellipsis">
          {data.query}
        </p>
      )}
      {!isOpen && (
        <p className="ml-auto text-sm font-regular text-brown2 flex-shrink-0">
          {formatDate(data.created_at)}
        </p>
      )}
    </div>
  );
};

const UserQuestion = ({ contentText }: { contentText: string }) => {
  return (
    <div
      className="inline-block self-end bg-[#FFE5C1] rounded-xl rounded-br-none py-2 px-4 
        overflow-hidden max-w-3/4 border-[1px] border-black border-opacity-10 bg-clip-padding ml-auto"
    >
      <p className="inline text-right text-[#111111] text-[0.9375rem] whitespace-pre-line break-words">
        {contentText}
      </p>
    </div>
  );
};

export default ConversationSummary;