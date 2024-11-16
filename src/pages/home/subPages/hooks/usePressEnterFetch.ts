import { KeyboardEvent } from 'react';

// Enter keyboard 동작 확인 시, submit 동작 수행
// form 형식은 textarea 못 써서, keyboard 입력으로 직접 수행
const usePressEnterFetch = ({
  handleShiftWithCtrl,
  handleEnterWithCtrl,
  handleEnter,
}: {
  handleShiftWithCtrl?: () => void;
  handleEnterWithCtrl?: () => void;
  handleEnter?: () => void;
}) => {
  const handlePressEnterFetch = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (
      handleEnterWithCtrl &&
      ((e.key === 'Enter' && e.ctrlKey) || (e.key === 'Enter' && e.metaKey))
    ) {
      e.preventDefault();
      handleEnterWithCtrl();
    } else if (handleShiftWithCtrl && e.key === 'Enter' && e.shiftKey) {
      handleShiftWithCtrl();
    } else if (
      handleEnter &&
      e.key === 'Enter' &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.shiftKey &&
      !e.altKey
    ) {
      e.preventDefault();
      handleEnter();
    }
  };

  return { handlePressEnterFetch };
};

export default usePressEnterFetch;
