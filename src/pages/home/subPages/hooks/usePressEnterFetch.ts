import { KeyboardEvent } from 'react';

// Enter keyboard 동작 확인 시, submit 동작 수행
// form 형식은 textarea 못 써서, keyboard 입력으로 직접 수행
const usePressEnterFetch = ({
  handleEnterWithCtrl,
  handleEnter,
}: {
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
    } else if (handleEnter && e.key === 'Enter') {
      e.preventDefault();
      handleEnter();
    }
  };

  return { handlePressEnterFetch };
};

export default usePressEnterFetch;
