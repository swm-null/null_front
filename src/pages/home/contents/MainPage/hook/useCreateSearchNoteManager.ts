import { useState, useEffect } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import {
  createMemo,
  isCreateMemoResponse,
  isSearchMemoResponse,
  isValidResponse,
  searchMemo,
} from 'utils/auth';
import {
  Memo,
  MemoSearchConversation,
  Mode,
  Status,
} from 'pages/home/contents/_interfaces';

const MAX_SEARCH_QUERIES = 100;

const useCreateSearchNoteManager = (mode: Mode) => {
  const [createAnswer, setCreateAnswer] = useState<Memo>();
  const [searchAnswer, setSearchAnswer] = useState<MemoSearchConversation>();
  const [status, setStatus] = useState<Status>('default');

  useEffect(() => {
    setStatus('default'); // mode가 변경될 때마다 status를 초기화
  }, [mode]);

  const tryCreateMemoAndSetStatus = async (
    message: string,
    setMessage: (message: string) => void
  ) => {
    if (message.trim()) {
      setMessage('');
      setStatus('loading');
      try {
        const answer = await getCreateResponse(message);
        setCreateAnswer(answer);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }
  };

  const getCreateResponse = async (text: string): Promise<Memo> => {
    const response = await createMemo(text);

    if (!isValidResponse(response)) {
      return {
        id: uuid_v4(),
        content:
          '추가를 하는 과정에서 오류가 났습니다. 새로 고침 후 다시 시도해주세요',
        tags: [],
        image_urls: null,
        updated_at: null,
        created_at: null,
      };
    }

    if (isCreateMemoResponse(response)) {
      return {
        id: response.id,
        content: response.content,
        tags: response.tags,
        image_urls: response.image_urls,
        updated_at: response.updated_at,
        created_at: response.created_at,
      };
    }

    throw new Error('Unexpected response format');
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
        const newSearchAnswer = {
          id: uuid_v4(),
          query: message,
          answer: answer,
        };
        saveSearchHistory(newSearchAnswer);
        setSearchAnswer(newSearchAnswer);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }
  };

  const getSearchResponse = async (text: string) => {
    const response = await searchMemo(text);

    if (!isValidResponse(response)) {
      return {
        text: '검색을 하는 과정에서 오류가 났습니다. 새로 고침 후 다시 검색해주세요',
        memos: null,
      };
    }

    if (isSearchMemoResponse(response)) {
      return {
        text: response.text,
        memos: response.memos,
      };
    }

    throw new Error('Unexpected response format');
  };

  const saveSearchHistory = (newSearchAnswer: MemoSearchConversation) => {
    const searchConversations = JSON.parse(
      localStorage.getItem('search_queries') || '[]'
    );
    searchConversations.unshift(newSearchAnswer);

    if (searchConversations.length > MAX_SEARCH_QUERIES) {
      searchConversations.length = MAX_SEARCH_QUERIES;
    }

    localStorage.setItem('search_queries', JSON.stringify(searchConversations));
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
