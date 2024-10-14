import { KeyboardEvent } from 'react';

// Enter keyboard 동작 확인 시, submit 동작 수행
// form 형식은 textarea 못 써서, keyboard 입력으로 직접 수행
const usePressEnterFetch = ({
  handleCtrlSubmit,
  handleETCEnterSubmit,
}: {
  handleCtrlSubmit?: () => void;
  handleETCEnterSubmit?: () => void;
}) => {
  const handlePressEnterFetch = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (
      handleCtrlSubmit &&
      ((e.key === 'Enter' && e.ctrlKey) || (e.key === 'Enter' && e.metaKey))
    ) {
      e.preventDefault();
      handleCtrlSubmit();
    } else if (handleETCEnterSubmit && e.key === 'Enter') {
      e.preventDefault();
      handleETCEnterSubmit();
    }
  };

  return { handlePressEnterFetch };
};

export default usePressEnterFetch;
