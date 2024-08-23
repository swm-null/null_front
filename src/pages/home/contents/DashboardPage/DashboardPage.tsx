import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SIDEBAR_HEADER_ANIMATION_DURATION,
  TAG_INVALID_CHARS_PATTERN,
} from 'pages/home/constants';
import { AnimatedHeader, UneditableTag } from 'pages/home/contents/_components';
import { CurrentTagPath, MemoEditModal, TaggedMemosList } from './components';
import { useSelectedTagMemosManager, useTagsManager } from './hooks';
import { Memo, Tag } from '../_interfaces';

const DashboardPage = ({
  headerLeftMarginToggle = false,
  headerLeftMargin = 0,
}: {
  headerLeftMarginToggle?: boolean;
  headerLeftMargin?: number;
}) => {
  const { t } = useTranslation();
  const { tags, handleTagClick, clickAllTags } = useTagsManager();
  const { taggedMemos, updateViewMemo, deleteViewMemo, revertViewMemo } =
    useSelectedTagMemosManager(tags);

  const [open, setOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<Memo>();
  const [selectedMemoTag, setSelectedMemoTag] = useState<Tag>();
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

  const handleMemoClick = (memo: Memo, tag: Tag, index: number) => {
    setOpen(true);
    setSelectedMemo(memo);
    setSelectedMemoTag(tag);
    setSelectedMemoIndex(index);
  };

  return (
    <div className="flex flex-col h-screen text-gray2 overflow-hidden">
      <AnimatedHeader
        text={t('pages.dashboard.header')}
        leftMarginToggle={headerLeftMarginToggle}
        leftMargin={headerLeftMargin}
        animationDuration={SIDEBAR_HEADER_ANIMATION_DURATION}
      />

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

      <div className="flex flex-1 pb-4 px-4 overflow-hidden">
        <div className="flex gap-4 overflow-x-scroll">
          {taggedMemos.map(({ tag, childTags, memos }, _) =>
            memos.length !== 0 ? (
              <TaggedMemosList
                tag={tag}
                childTags={childTags}
                memos={memos}
                handleMemoClick={handleMemoClick}
              />
            ) : null
          )}
        </div>
      </div>

      {/* 메모 수정 창 */}
      <MemoEditModal
        open={open}
        handleClose={handleClose}
        selectedMemo={selectedMemo}
        selectedMemoTag={selectedMemoTag}
        selectedMemoIndex={selectedMemoIndex}
        updateViewMemo={updateViewMemo}
        deleteViewMemo={deleteViewMemo}
        revertViewMemo={revertViewMemo}
      />
    </div>
  );
};

export default DashboardPage;
