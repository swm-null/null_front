import React, { useState } from 'react';
import { AnimatedHeader } from '../component/AnimatedHeader';
import MemoList from './component/MemoList';
import { Memo } from '../interface/MemoInterface';
import { MemoTextInput } from './component/MemoTextInput';
import { addMemo, isAddMemoResponse, isValidResponse } from '../util/auth';
import { HEADER_ANIMATION_DELAY, HEADER_ANIMATION_DURATION } from '../constants/HeaderSideBarAnimation';

export const AddPage = ({ headerLeftMarginToggle }: { headerLeftMarginToggle?: boolean}) => {
  const [message, setMessage] = useState('');
  const [memos, setMemos] = useState<Memo[]>([]);
  const [status, setStatus] = useState<'default' | 'loading' | 'success' | 'error'>('default');

  const updateMemo = (index: number, newMemo: Memo) => {
    setMemos((prev) => prev.map((memo, i) => (i === index ? newMemo : memo)));
  };

  const deleteMemo = (index: number) => {
    setMemos((prev) => prev.filter((memo, i) => i !== index));
  };

  // generate 화면에 나오는 메모 객체 내용을 만들어주는 메소드
  const generateMemoResultContext = async (text: string) => {
    const response = await addMemo(text);
    if (!isValidResponse(response)) {
      throw new Error('error');
    }

    const answer = 
      (isAddMemoResponse(response)) ? 
        {
          id: response.id,
          content: response.content,
          tags: response.tags
        }
      : {
          id: '1',
          content: '테스트. 존재하지 않아야 정상인데 혹시 모르니',
          tags: []
        };

    return answer as Memo;
  }

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

  /**
   * TODO: 디버깅용 or 기능 살리기? 2024.06.28
   * 메모를 추가하거나, 작성 도중에 화면을 비우고 싶을 때 사용하는 기능
   */
  const handleRefresh = () => {
    setMemos([]);
    setMessage('');
    setStatus('default');
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setStatus('default');
  };

  // FIXME: 하드 코딩된 텍스트 나중에 다국어지원(react-i18next)을 위해 변수로 관리
  return (
    <div className="flex flex-col flex-1 h-screen text-gray2">
      <AnimatedHeader 
        text={'메모 추가하기'} 
        leftMarginToggle={headerLeftMarginToggle}
        animationDuration={HEADER_ANIMATION_DURATION} 
        toggleOnDurationDelay={HEADER_ANIMATION_DELAY}/>
      <div className="pb-4 px-4 flex flex-col flex-1 overflow-hidden">
        <MemoTextInput
          value={message}
          onChange={handleMessageChange}
          placeholder="입력 프롬프트"
          onButtonClick={updateMemoResultList}
          status={status}/>
        {/* 메모 AI로 생성하기 결과 보여주는 div */}
        <div className="flex flex-col flex-1">
          {status === 'error' && <span className="error-text">{"죄송합니다. 메모 추가 중에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."}</span>}
          {status==='success' && <MemoList memos={memos} updateMemo={updateMemo} deleteMemo={deleteMemo}/>}
        </div>
        <button className="mt-2 bg-gray2 text-white rounded-lg py-2 px-6" onClick={handleRefresh}>
          새로고침(임시 버튼)
        </button>
      </div>
    </div>
  );
};
