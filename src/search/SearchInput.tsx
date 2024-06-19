import React, { useState } from 'react';

export const SearchInput = ({addSearchQuery, editSearchQuery}: 
  {
    addSearchQuery: (text: string) => string, 
    editSearchQuery: (id: string, text: string) => void
  }) => {
  const [message, setMessage] = useState('');

  const getSearchResponse = async (id: string, text: string) => {
    const answer = 'answer';
    return answer;
  }

  const editSearchText = async (id: string, text: string) => {
    const answer = await getSearchResponse(id, text);
    editSearchQuery(id, answer);
  }

  const addSearchQueries = (text: string) => {
    const answerID = addSearchQuery(text);

    editSearchText(answerID, text);
  };


  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      // 여기서 메시지를 서버로 전송하는 로직을 추가할 수 있습니다.
      addSearchQueries(message);
      setMessage('');
    }
  };

  return (
    <div className="flex items-start m-4 pt-4 border-t border-gray-300">
      <textarea
        value={message}
        onChange={handleInputChange}
        className="flex-1 px-4 py-2 h-[110px] focus:outline-none resize-none"
        placeholder="입력 프롬프트"
        rows={6} // 줄 수를 설정할 수 있습니다.
      />
      <button
        onClick={handleSendClick}
        className="mt-2 ml-4 bg-black text-white rounded-full py-2 px-6"
      >
        검색
      </button>
    </div>
  );
};
