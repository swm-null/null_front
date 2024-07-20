import { useState } from 'react';
import { Memo } from 'pages/interfaces/MemoInterface';
import { createMemo, isCreateMemoResponse, isValidResponse } from 'utils/auth';

/**
 * 서버와 통신하여, 입력한 메모 내용으로 태그를 가진 메모 리스트(resultMemos)를 생성하고,
 * 메모를 수정, 삭제할 경우 변경 사항을 관리하는 컴퍼넌트
 *
 * 서버의 response를 기다리는 동안 status를 loading으로 바꾸며,
 * 에러의 경우 포함하여 status까지 관리해주는 컴퍼넌트
 */
const useResultMemoManagerWithStatus = () => {
  const [resultMemos, setResultMemos] = useState<Memo[]>([]);
  const [status, setStatus] = useState<
    'default' | 'loading' | 'success' | 'error'
  >('default');

  const updateResultMemo = (index: number, newMemo: Memo) => {
    setResultMemos((prev) =>
      prev.map((memo, i) => (i === index ? newMemo : memo))
    );
  };

  const deleteResultMemo = (index: number) => {
    setResultMemos((prev) => prev.filter((_, i) => i !== index));
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

  /**
   * 메모 내용으로 태그가 있는 메모를 서버에 보내 생성하고, 그 과정을 status로 표시한다.
   * @param message: string. 태그 있는 메모를 자동생성하고 싶은 메모 내용
   */
  const createResultMemosAndEditStatus = async (message: string) => {
    setStatus('loading');
    try {
      const answer = await getResultMemoContext(message);
      setResultMemos([answer]);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  const resetResultMemos = () => {
    setResultMemos([]);
    setStatus('default');
  };

  return {
    resultMemos,
    status,
    updateResultMemo,
    deleteResultMemo,
    createResultMemosAndEditStatus,
    resetResultMemos,
    setStatus,
  };
};

export default useResultMemoManagerWithStatus;
