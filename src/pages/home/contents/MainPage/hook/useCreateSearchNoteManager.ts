import {
  createMemo,
  isCreateMemoResponse,
  isSearchMemoResponse,
  isValidResponse,
  searchMemo,
} from 'utils/auth';
import { v4 as uuid_v4 } from 'uuid';
import { Memo, MemoSearchConversation } from '../../@interfaces';
import { useState } from 'react';

const useCreateSearchNoteManager = () => {
  const [createAnswer, setCreateAnswer] = useState<Memo>();
  const [searchAnswer, setSearchAnswer] = useState<MemoSearchConversation>();
  const [status, setStatus] = useState<
    'default' | 'loading' | 'success' | 'error'
  >('default');

  /**
   * 메모 내용으로 태그가 있는 메모를 서버에 보내 생성하고, 그 과정을 status로 표시한다.
   * @param message: string. 태그 있는 메모를 자동생성하고 싶은 메모 내용
   */
  const tryCreateMemoAndSetStatus = async (
    message: string,
    setMessage: (message: string) => void
  ) => {
    if (message.trim()) {
      setMessage('');

      setStatus('loading');
      try {
        const answer = await getResultMemoContext(message);
        setCreateAnswer(answer);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }
  };

  const getResultMemoContext = async (text: string): Promise<Memo> => {
    const response = await createMemo(text);

    // 에러 response이거나 올바르지 않은 response인 경우 error 발생시킴.
    if (!isValidResponse(response)) {
      throw new Error('not valid status error');
    } else if (!isCreateMemoResponse(response)) {
      throw new Error('not valid response structure error');
    }

    const answer = {
      id: response.id,
      content: response.content,
      tags: response.tags,
    };

    return answer as Memo;
  };

  const trySearchMemoAndSetStatus = async (
    message: string,
    setMessage: (message: string) => void
  ) => {
    if (message.trim()) {
      setMessage('');

      setStatus('loading');
      try {
        const answer = await getSearchResponse(message);
        setSearchAnswer({ id: uuid_v4(), query: message, answer: answer });
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }
  };

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

  return {
    status,
    createAnswer,
    searchAnswer,
    tryCreateMemoAndSetStatus,
    trySearchMemoAndSetStatus,
  };
};

export default useCreateSearchNoteManager;
