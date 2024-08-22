import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SIDEBAR_HEADER_ANIMATION_DURATION,
  TAG_INVALID_CHARS_PATTERN,
} from 'pages/home/constants';
import {
  AnimatedHeader,
  UneditableTag,
  MemosList,
  EditableMemo,
  UneditableMemo,
} from 'pages/home/contents/_components';
import { CurrentTagPath } from './components';
import { useSelectedTagMemosManager, useTagsManager } from './hooks';
import { Memo, Tag } from '../_interfaces';
import { Modal } from '@mui/material';

const DashboardPage = ({
  headerLeftMarginToggle = false,
  headerLeftMargin = 0,
}: {
  headerLeftMarginToggle?: boolean;
  headerLeftMargin?: number;
}) => {
  const { t } = useTranslation();

  const { tags, selectedTag, handleTagClick, clickAllTags } = useTagsManager();

  const { viewMemos, updateViewMemo, deleteViewMemo, revertViewMemo } =
    useSelectedTagMemosManager(selectedTag);

  const [open, setOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<Memo>();
  const [selectedMemoIndex, setSelectedMemoIndex] = useState(0);

  // 클릭한 태그 경로
  const [tagStack, setTagStack] = useState<Tag[]>([]);

  // 자식 태그 리스트에 있는 태그 클릭 시, stack에 추가
  const addTagToStack = (tag: Tag) => {
    setTagStack((prevStack) => [...prevStack, tag]);
    handleTagClick(tag);
  };

  // 모든 메모 태그 클릭 시 수행되는 코드
  const handleAllTags = () => {
    setTagStack([]);
    clickAllTags();
  };

  // tag stack에서 특정 index의 태그 클릭 시 수행되는 코드
  const selectTagAtIndex = (index: number) => {
    setTagStack((prevStack) => prevStack.slice(0, index + 1));
    const tag = tagStack[index];
    handleTagClick(tag);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMemo(undefined);
  };

  const handleMemoClick = (memo: Memo, index: number) => {
    setOpen(true);
    setSelectedMemo(memo);
    setSelectedMemoIndex(index);
  };

  return (
    <div className="flex flex-col flex-1 h-screen text-gray2">
      <AnimatedHeader
        text={t('pages.dashboard.header')}
        leftMarginToggle={headerLeftMarginToggle}
        leftMargin={headerLeftMargin}
        animationDuration={SIDEBAR_HEADER_ANIMATION_DURATION}
      />

      <Modal
        open={open}
        // FIXME: 모달 바깥 layout 클릭할 때, onClose 동작 안함
        onClose={handleClose}
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg">
            {selectedMemo ? (
              <EditableMemo
                key={selectedMemoIndex}
                memo={selectedMemo}
                editable
                softUpdateMemo={updateViewMemo}
                softDeleteMemo={deleteViewMemo}
                softRevertMemo={(selectedMemo) =>
                  revertViewMemo(selectedMemoIndex, selectedMemo)
                }
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </Modal>

      {/* tag들 선택하는 부분 */}
      <CurrentTagPath
        allTagText={t('pages.dashboard.allMemoButton')}
        tagStack={tagStack}
        onTagClickAtIndex={selectTagAtIndex}
        onAllTagClick={handleAllTags}
        invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
      >
        {tags.map((tag, index) => (
          <UneditableTag
            key={index}
            text={tag.name}
            invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
            onClick={() => addTagToStack(tag)}
          />
        ))}
      </CurrentTagPath>

      <div className="pb-4 px-4 flex flex-col flex-1 overflow-hidden">
        <MemosList>
          {viewMemos.map((memo, index) => (
            <UneditableMemo
              key={memo.id}
              memo={memo}
              onClick={() => handleMemoClick(memo, index)}
              softDeleteMemo={deleteViewMemo}
              softRevertMemo={(memo) => revertViewMemo(index, memo)}
            />
          ))}
        </MemosList>
      </div>
    </div>
  );
};

export default DashboardPage;
