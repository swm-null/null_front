import React, { useState } from 'react';
import { SIDEBAR_HEADER_ANIMATION_DURATION } from 'config/constants';
import useResultMemoManagerWithStatus from './hook/useResultMemoManagerWithStatus';
import { AnimatedHeader } from 'components/ui';
import { MemoTextAreaWithAIButton, ResultMemoList } from './components';

export const AddPage = ({
  headerLeftMarginToggle = false,
  headerLeftMargin = 0,
}: {
  headerLeftMarginToggle?: boolean;
  headerLeftMargin?: number;
}) => {
  const [message, setMessage] = useState('');
  const {
    resultMemos,
    status,
    updateResultMemo,
    deleteResultMemo,
    createResultMemosAndEditStatus,
    resetResultMemos,
    setStatus,
  } = useResultMemoManagerWithStatus();

  // input의 text가 수정 되면, status를 default로 초기화
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setStatus('default');
  };

  const handleRefresh = () => {
    resetResultMemos();
    setMessage('');
  };

  const handleUpdateResultMemoListAndStatus = async () => {
    await createResultMemosAndEditStatus(message);
  };

  return (
    <div className="flex flex-col flex-1 h-screen text-gray2">
      <AnimatedHeader
        text={'메모 추가하기'}
        leftMarginToggle={headerLeftMarginToggle}
        leftMargin={headerLeftMargin}
        animationDuration={SIDEBAR_HEADER_ANIMATION_DURATION}
      />
      <div className="pb-4 px-4 flex flex-col flex-1 overflow-hidden">
        <MemoTextAreaWithAIButton
          value={message}
          onChange={handleMessageChange}
          placeholder="입력 프롬프트"
          onButtonClick={handleUpdateResultMemoListAndStatus}
          status={status}
        />
        <div className="flex flex-col flex-1">
          {status === 'error' && (
            <span className="error-text">
              {
                '죄송합니다. 메모 추가 중에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
              }
            </span>
          )}
          {status === 'success' && (
            <ResultMemoList
              memos={resultMemos}
              updateResultMemo={updateResultMemo}
              deleteResultMemo={deleteResultMemo}
            />
          )}
        </div>
        <button
          className="mt-2 bg-gray2 text-white rounded-lg py-2 px-6"
          onClick={handleRefresh}
        >
          새로고침(임시 버튼)
        </button>
      </div>
    </div>
  );
};
