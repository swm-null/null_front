import React, { useState } from 'react';
import { isSearchMemoResponse, searchMemo } from '../util/auth.tsx';
import { Answer } from './interface/Answer.tsx';

export const SearchInput = ({addSearchQuery, editSearchQuery}: 
  {
    addSearchQuery: (text: string) => string, 
    editSearchQuery: (id: string, answer: Answer) => void
  }) => {
  const [message, setMessage] = useState('');

  const getSearchResponse = async (text: string) => {
    const response = await searchMemo(text);
    var answer;
    if (isSearchMemoResponse(response)) {
      answer = {
        text: '관련 메모는 다음과 같습니다',
        memos: response.memos
      };
    } else {
      answer = {
        text: response.message,
        memos: null
      }
    }
    
    return answer;
  }

  const editSearchAnswer = async (id: string, text: string) => {
    const answer = await getSearchResponse(text);
    editSearchQuery(id, answer);
  }

  const addSearchQueries = (text: string) => {
    const answerID = addSearchQuery(text);

    editSearchAnswer(answerID, text);
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
