import React, { useState } from 'react';
import { AnimatedHeader } from '../component/AnimatedHeader';
import MemoList from './component/MemoList';
import { Memo } from '../interface/MemoInterface';
import { MemoTextInput } from './component/MemoTextInput';
import { addMemo, isAddMemoResponse, isValidResponse } from '../util/auth';

export const AddPage = ({headerLeftMarginToggle, headerLeftMargin, headerAnimationDuration, headerToggleOnDuration, headerToggleOffDuration}: {
    headerLeftMarginToggle?: boolean
    headerLeftMargin?: number
    headerAnimationDuration?: number
    headerToggleOnDuration?: number
    headerToggleOffDuration?: number
  }) => {
  const [message, setMessage] = useState('');
  const [memos, setMemos] = useState<Memo[]>([]);

  const updateMemo = (index: number, newMemo: Memo) => {
    setMemos((prev) => prev.map((memo, i) => (i === index ? newMemo : memo)));
  };

  const deleteMemo = (index: number) => {
    setMemos((prev) => prev.filter((memo, i) => i !== index ));
  };

  // generate 화면에 나오는 메모 객체 내용을 만들어주는 메소드
  const generateMemoResultContext = async (text: string) => {
    const response = await addMemo(text);
    const answer = 
      (!isValidResponse(response)) ? 
        {
          id: '1',
          content: '죄송합니다. 메모 추가 중에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          tags: []
        }
      : (isAddMemoResponse(response)) ? 
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
    const answer = await generateMemoResultContext(message);
    setMemos([answer]);
  };

  /**
   * TODO: 디버깅용 or 기능 살리기? 2024.06.28
   * 메모를 추가하거나, 작성 도중에 화면을 비우고 싶을 때 사용하는 기능
   */
  const handleRefresh = () => {
    setMemos([]);
    setMessage('');
  };

  // FIXME: 하드 코딩된 텍스트 나중에 다국어지원(react-i18next)을 위해 변수로 관리
  return (
    <div className="flex flex-col flex-1 h-screen text-gray2">
      <AnimatedHeader 
        text={'메모 추가하기'} 
        leftMarginToggle={headerLeftMarginToggle}
        leftMargin={headerLeftMargin}
        animationDuration={headerAnimationDuration} 
        toggleOnDurationDelay={headerToggleOnDuration}
        toggleOffDurationDelay={headerToggleOffDuration}/>
        <div className="pb-4 px-4 flex flex-col flex-1 overflow-hidden">
        {/* TODO: 메모 내용 없으면, 버튼 비활성화 */}
        <MemoTextInput
          value={message}
          onChange={setMessage}
          placeholder="입력 프롬프트"
          onButtonClick={updateMemoResultList}
          buttonText="메모 AI로 생성하기"
        />
        <div className="flex flex-col flex-1">
          {memos.length !== 0 && <span className="mt-3">AI로 생성한 메모를 추가했습니다. </span>}
          <MemoList memos={memos} updateMemo={updateMemo} deleteMemo={deleteMemo}/>
        </div>
        <button className="mt-2 bg-gray2 text-white rounded-lg py-2 px-6" onClick={handleRefresh}>
          새로고침(임시 버튼)
        </button>
      </div>
    </div>
  );
};
