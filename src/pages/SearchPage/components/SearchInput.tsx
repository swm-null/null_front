import React, { useState } from 'react';
import { isSearchMemoResponse, isValidResponse, searchMemo } from 'utils/auth';
import { MemoSearchAnswer } from 'interfaces/MemoInterface';

export const SearchInput = ({addSearchConversation, editSearchConversation}: 
  {
    addSearchConversation: (text: string) => string, 
    editSearchConversation: (id: string, answer: MemoSearchAnswer) => string, 
  }) => {
  const [message, setMessage] = useState('');

  const getSearchResponse = async (text: string) => {
    const response = await searchMemo(text);
    const answer = 
      (!isValidResponse(response)) ? 
        {
          text: '검색을 하는 과정에서 오류가 났습니다. 새로 고침 후 다시 검색해주세요',
          memos: null
        }
      : (isSearchMemoResponse(response)) ? 
        {
          /**
           * FIXME: text에 원래는 메모 검색 기능으로 생기는 자연어 메시지를 보여줘야하는데, 
           * 현재 자연어 검색으로 자동 전환해주는 기능이 없어 지금은 하드 코딩
           */
          text: '메모 검색을 완료했습니다',
          memos: response.memos
        }
      : {
          text: '관련된 메모가 없습니다',
          memos: null
        };
    return answer;
  }

  const addSearchQueries = async (text: string) => {
    // 검색 내용과 답변 메시지 객체 추가(이 때, 답변 메시지 내용은 없음)
    const answerID = addSearchConversation(text);

    // 검색 answer 메시지의 내용을 서버에 요청하고 받으면, 객체 수정
    const answer = await getSearchResponse(text);
    editSearchConversation(answerID, answer);
  };

  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (message.trim()) {
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
        rows={6}
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
