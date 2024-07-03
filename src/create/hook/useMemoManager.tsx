import { useState } from 'react';
import { Memo } from '../../interface/MemoInterface';
import { addMemo, isAddMemoResponse, isValidResponse } from '../../util/auth';

const useMemoManager = () => {
  const [message, setMessage] = useState('');
  const [memos, setMemos] = useState<Memo[]>([]);
  const [status, setStatus] = useState<'default' | 'loading' | 'success' | 'error'>('default');

  const updateMemo = (index: number, newMemo: Memo) => {
    setMemos((prev) => prev.map((memo, i) => (i === index ? newMemo : memo)));
  };

  const deleteMemo = (index: number) => {
    setMemos((prev) => prev.filter((memo, i) => i !== index));
  };

  const generateMemoResultContext = async (text: string): Promise<Memo> => {
    const response = await addMemo(text);
    if (!isValidResponse(response)) {
      throw new Error('error');
    }

    const answer = isAddMemoResponse(response)
      ? {
          id: response.id,
          content: response.content,
          tags: response.tags,
        }
      : {
          id: '1',
          content: '테스트. 존재하지 않아야 정상인데 혹시 모르니',
          tags: [],
        };

    return answer as Memo;
  };

  const updateMemoResultList = async () => {
    setStatus('loading');
    try {
      const answer = await generateMemoResultContext(message);
      setMemos([answer]);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  const handleRefresh = () => {
    setMemos([]);
    setMessage('');
    setStatus('default');
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setStatus('default');
  };

  return {
    message,
    memos,
    status,
    updateMemo,
    deleteMemo,
    updateMemoResultList,
    handleRefresh,
    handleMessageChange,
  };
};

export default useMemoManager;