import { MemoSearchAnswer } from 'interfaces/MemoInterface';
import { EditableMemo } from 'components/memo';
import { TextareaAutosize } from '@mui/material';

export const AIMessage = ({
  name,
  imageUrl,
  content,
}: {
  name: string;
  imageUrl: string;
  content: MemoSearchAnswer;
}) => {
  const answerRelatedMemos = content.memos?.map((memo) => {
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
        className="w-10 h-10 mr-4 object-cover rounded"
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <p className="text-lg font-semibold">{name}</p>
        <div className="p-3 inline-block self-start bg-gray0 rounded-lg overflow-hidden max-w-3/4">
          <TextareaAutosize
            className="inline bg-transparent resize-none focus:outline-none whitespace-normal break-words"
            value={content.text}
            readOnly
          />
          {content.memos && (
            <div className="w-full flex overflow-x-auto no-scrollbar gap-4">
              {answerRelatedMemos}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
