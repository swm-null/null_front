import React, { useState } from 'react';

export const SearchInput = ({addView, editView}: 
  {
    addView: (text: string, left: boolean) => string, 
    editView: (id: string, text: string) => void
  }) => {
  const [message, setMessage] = useState('');

  const getSearchResponse = async (id: string, text: string) => {
    const answer = 'answer';
    return answer;
  }

  const editSearchText = async (id: string, text: string) => {
    const answer = await getSearchResponse(id, text);
    editView(id, answer);
  }

  const addViews = (text: string) => {
    addView(text, false);
    const answerID = addView('', true);

    editSearchText(answerID, text);
  };


  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      // 여기서 메시지를 서버로 전송하는 로직을 추가할 수 있습니다.
      addViews(message);
      setMessage('');
    }
  };

  return (
    <div className="flex items-center m-4 pt-4 border-t border-gray-300">
      <textarea
        value={message}
        onChange={handleInputChange}
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 h-[110px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Type your message..."
        rows={6} // 줄 수를 설정할 수 있습니다.
      />
      <button
        onClick={handleSendClick}
        className="ml-4 bg-blue-500 text-white rounded-full py-2 px-6 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send
      </button>
    </div>
  );
};
