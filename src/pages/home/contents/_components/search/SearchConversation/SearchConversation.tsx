import { MemoSearchConversation } from 'pages/home/contents/_interfaces';
import { AIMessage, UserMessage } from './Message';

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
    <div key={data.id}>
      <UserMessage contentText={data.query} />
      <AIMessage
        name={chatBotName}
        imageUrl={chatBotImageUrl}
        content={data.answer}
      />
    </div>
  );
};

export default SearchConversation;
