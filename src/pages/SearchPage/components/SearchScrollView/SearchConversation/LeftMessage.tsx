import { MemoSearchAnswer } from 'interfaces/MemoInterface';
import { EditableMemo } from 'components/memo';

export const LeftMessage = ({
  name,
  imageUrl,
  content,
}: {
  name: string;
  imageUrl: string;
  content: MemoSearchAnswer;
}) => {
  const processedMessageContent = content.memos?.map((memo) => {
    return (
      <div
        key={memo.id}
        className="flex-shrink-0 rounded-lg w-72 whitespace-normal break-words text-base"
      >
        <EditableMemo memo={memo} />
      </div>
    );
  });

  return (
    <div className="mb-2 flex w-full">
      <img
        src={imageUrl}
        alt="Placeholder"
        className="w-9 h-9 mr-3 sm:mr-4 object-cover rounded"
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <p className="text-base sm:mb-1 font-semibold">{name}</p>
        <div className="text-base px-3 py-2 sm:px-4 sm:py-3 inline-block self-start bg-gray0 rounded-lg overflow-hidden max-w-3/4">
          <div className="inline bg-transparent resize-none focus:outline-none whitespace-normal break-words">
            {content.text}
          </div>
          {content.memos && (
            <div className="sm:mt-1 w-full flex overflow-x-auto no-scrollbar gap-4">
              {processedMessageContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
