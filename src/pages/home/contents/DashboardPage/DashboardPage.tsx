import { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useTranslation } from 'react-i18next';
import {
  SIDEBAR_HEADER_ANIMATION_DURATION,
  TAG_INVALID_CHARS_PATTERN,
} from 'pages/home/constants';
import {
  AnimatedHeader,
  MemosList,
  UneditableMemo,
  UneditableTag,
} from 'pages/home/contents/_components';
import { Memo, Tag } from 'pages/home/contents//_interfaces';
import { CurrentTagPath, MemoEditModal, TaggedMemosList } from './components';
import {
  useSelectedTagMemosManager,
  useTagsManager,
  useDragAndDropManager,
} from './hooks';

const DashboardPage = ({
  headerLeftMarginToggle = false,
  headerLeftMargin = 0,
}: {
  headerLeftMarginToggle?: boolean;
  headerLeftMargin?: number;
}) => {
  const { t } = useTranslation();
  const { selectedTag, tags, handleTagClick, clickAllTags } = useTagsManager();
  const {
    taggedMemos,
    updateViewMemo,
    updateTaggedMemos,
    deleteViewMemo,
    revertViewMemo,
  } = useSelectedTagMemosManager(tags, selectedTag);

  const { onDragEnd } = useDragAndDropManager(taggedMemos, updateTaggedMemos);

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

  const renderTaggedMemosList = () => {
    // 아무 메모, 아무 태그가 없는 경우
    if (taggedMemos.length === 0) {
      return null;
    }

    // 선택된 태그가 가장 마지막 단계의 태그인 경우
    if (taggedMemos.length === 1) {
      const taggedMemo = taggedMemos[0];

      return (
        <div className="px-4">
          <MemosList>
            {taggedMemo.memos.map((memo, _) => (
              <UneditableMemo memo={memo} />
            ))}
          </MemosList>
        </div>
      );
    }

    return (
      <div className="flex flex-1 h-full gap-4 overflow-x-scroll">
        <DragDropContext onDragEnd={onDragEnd}>
          {taggedMemos.map(({ tag, childTags, memos }) => {
            if (memos.length === 0) {
              // FIXME: 원래 있으면 안되는 오류임
              // throw new Error(`Memos should not be empty for tag: ${tag}`);
              return null;
            }

            if (!childTags) {
              throw new Error(`Child tags are missing for tag: ${tag}`);
            }

            return (
              <TaggedMemosList
                key={tag.id}
                tag={tag}
                childTags={childTags}
                memos={memos}
                handleTagClick={() => addTagToStack(tag)}
                handleMemoClick={handleMemoClick}
              />
            );
          })}
        </DragDropContext>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen text-gray2 overflow-hidden px-4">
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

      {renderTaggedMemosList()}

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
