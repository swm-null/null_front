import { MemoSearchConversation } from 'interfaces/MemoInterface';
import { AIMessage } from './AIMessage';
import { UserMessage } from './UserMessage';

export const SearchConversation = ({
  data,
  userName,
  chatBotName,
  userImageUrl,
  chatBotImageUrl,
  removeSearchConversation,
}: {
  data: MemoSearchConversation;
  userName: string;
  chatBotName: string;
  userImageUrl: string;
  chatBotImageUrl: string;
  removeSearchConversation: (id: string) => string;
}) => {
  return (
    <div key={data.id}>
      <UserMessage
        name={userName}
        contentText={data.query}
        imageUrl={userImageUrl}
      />
      <AIMessage
        name={chatBotName}
        imageUrl={chatBotImageUrl}
        content={data.answer}
      />
      <button
        onClick={() => removeSearchConversation(data.id)}
        // FIXME: 2024.07.14 나중에 이 버튼 자체를 삭제하거나, UI를 바꾸거나 하기.
        // 버튼 안 보이게 하기 위한 임시 hidden 처리
        className="hidden h-8 top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
      >
        Remove
      </button>
    </div>
  );
};
