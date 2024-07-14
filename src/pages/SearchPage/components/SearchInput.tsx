import React, { useState } from 'react';
import { isSearchMemoResponse, isValidResponse, searchMemo } from 'utils/auth';
import { MemoSearchAnswer } from 'interfaces/MemoInterface';

// Enter keyboard 동작 확인 시, submit 동작 수행
// form 형식은 textarea 못 써서, keyboard 입력으로 직접 수행
const usePressEnterFetch = ({ handleSubmit }: { handleSubmit: () => void }) => {
  const handlePressEnterFetch = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    // shift + Enter는 해당 안되도록 체크 후 submit
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return { handlePressEnterFetch };
};

export const SearchInput = ({
  addSearchConversation,
  editSearchConversation,
}: {
  addSearchConversation: (text: string) => string;
  editSearchConversation: (id: string, answer: MemoSearchAnswer) => string;
}) => {
  const [message, setMessage] = useState('');
  const { handlePressEnterFetch } = usePressEnterFetch({
    handleSubmit: submitSearchQuery,
  });

  const getSearchResponse = async (text: string) => {
    const response = await searchMemo(text);
    const answer = !isValidResponse(response)
      ? {
          text: '검색을 하는 과정에서 오류가 났습니다. 새로 고침 후 다시 검색해주세요',
          memos: null,
        }
      : isSearchMemoResponse(response)
        ? {
            text: response.text,
            memos: response.memos,
          }
        : {
            text: '관련된 메모가 없습니다',
            memos: null,
          };
    return answer;
  };

  const addSearchConversationWithLateUpdateResponse = async (text: string) => {
    // 검색 내용과 답변 메시지 객체 추가(이 때, 답변 메시지 내용은 없음)
    const answerID = addSearchConversation(text);

    // 검색 answer 메시지의 내용을 서버에 요청하고 받으면, 객체 수정
    const answer = await getSearchResponse(text);
    editSearchConversation(answerID, answer);
  };

  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMessage(e.target.value);
  };

  function submitSearchQuery() {
    if (message.trim()) {
      addSearchConversationWithLateUpdateResponse(message);
      setMessage('');
    }
  }

  return (
    <div className="flex items-start m-4 pt-4 border-t border-gray-300">
      <textarea
        value={message}
        onChange={handleInputChange}
        className="flex-1 px-4 py-2 h-[110px] focus:outline-none resize-none"
        placeholder="입력 프롬프트"
        onKeyDown={handlePressEnterFetch}
        rows={6}
      />
      <button
        onClick={submitSearchQuery}
        className="mt-2 ml-4 bg-black text-white rounded-full py-2 px-6"
      >
        검색
      </button>
    </div>
  );
};
