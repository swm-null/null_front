import { MemoSearchAnswer } from 'pages/home/subPages/interfaces';
import { MemosList, UneditableMemo } from 'pages/home/subPages/components';

const AIMessage = ({
  name,
  imageUrl,
  content,
}: {
  name: string;
  imageUrl: string;
  content: MemoSearchAnswer;
}) => {
  return (
    <div className="mb-2 flex flex-col w-full">
      <div className="flex w-full pr-4">
        <img
          src={imageUrl}
          alt="Placeholder"
          className="w-10 h-10 mr-4 object-cover rounded-full"
        />

        <div className="w-full mt-[6px]">
          <p className="text-lg font-semibold mb-2">{name}</p>
          <div className="inline bg-transparent resize-none focus:outline-none whitespace-pre-wrap break-words">
            {content.text}
          </div>
        </div>
      </div>

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
  );
};

export default AIMessage;
