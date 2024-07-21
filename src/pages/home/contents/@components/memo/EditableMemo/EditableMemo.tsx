import { useState, useCallback } from 'react';
import { TagManager } from './TagManager';
import { MemoText } from './MemoText';
import { Memo } from 'pages/home/contents/@interfaces';
import {
  deleteMemo,
  updateMemo,
  isUpdateMemoResponse,
  isValidResponse,
} from 'utils/auth';
import { debounce } from 'lodash';

const EditableMemo = ({
  memo,
  editable = false,
}: {
  memo: Memo;
  editable?: boolean;
}) => {
  const { id, content, tags: originTags } = memo;
  const [message, setMessage] = useState(content);
  const [tags, setTags] = useState(originTags);
  const [hidden, setHidden] = useState(false);

  const handleDelete = async () => {
    setHidden(true);

    const response = await deleteMemo(memo.id);
    // 메모 삭제 실패, 메모 다시 화면에 추가
    if (!isValidResponse(response)) {
      // FIXME: 일단, 알림만 띄우는데, 다른 방법으로 수정해야함.
      // 다시 삭제 하시겠습니까? 같은거 띄워야하나 고민중
      alert('메모 삭제에 실패했습니다. 다시 시도해 주세요.');
      setHidden(false);
    }
  };

  const debouncedUpdateMemo = useCallback(
    debounce(async (newMemo: Memo) => {
      const response = await updateMemo(newMemo.id, newMemo.content);
      // 메모 수정 실패시, 이전 메모 내용으로 화면에 표시
      if (!isUpdateMemoResponse(response)) {
        // FIXME: 일단, 알림만 띄우는데, 다른 방법으로 수정해야함.
        // 다시 업데이트 하시겠습니까? 같은거 띄워야하나 고민중
        alert('메모 업데이트에 실패했습니다. 다시 시도해 주세요.');
      }
    }, 1000), // 1000ms 디바운스
    [memo]
  );

  const handleBlur = () => {
    const newMemo = { id, content: message, tags };

    // FIXME: 2024.07.21 - tag 업데이트 기능 추가시 적용하기
    // const arraysEqual = (a: any[], b: any[]) => {
    //   return JSON.stringify(a) === JSON.stringify(b);
    // };
    // if (
    //   memo.content !== newMemo.content ||
    //   !arraysEqual(memo.tags, newMemo.tags)
    // )

    // 메모 내용 달라진 것이 있을 때에만 서버에 업데이트 요청
    if (memo.content !== newMemo.content) {
      debouncedUpdateMemo(newMemo);
    }
  };

  return (
    <div
      className={`p-2 grid first-letter:flex-col bg-gray1 rounded-md border-[1px] ${hidden && 'hidden'}`}
    >
      <MemoText
        message={message}
        setMessage={setMessage}
        editable={editable}
        handleBlur={handleBlur}
      />
      <TagManager tags={tags} setTags={setTags} editable={editable} />
      {editable && (
        <button
          className="text-right justify-self-end mt-2 bg-gray2 text-white rounded-full py-2 px-6"
          onClick={handleDelete}
        >
          삭제
        </button>
      )}
    </div>
  );
};

export default EditableMemo;
