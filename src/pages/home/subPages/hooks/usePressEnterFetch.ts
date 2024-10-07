import { KeyboardEvent } from 'react';

// Enter keyboard 동작 확인 시, submit 동작 수행
// form 형식은 textarea 못 써서, keyboard 입력으로 직접 수행
const usePressEnterFetch = ({ handleSubmit }: { handleSubmit: () => void }) => {
  const handlePressEnterFetch = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return { handlePressEnterFetch };
};

export default usePressEnterFetch;
