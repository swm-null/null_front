import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Memo, Tag } from 'pages/home/contents/_interfaces';
import { CurrentTagPath, MemoEditModal, TaggedMemosList } from './components';
import * as Constants from 'pages/home/constants';
import * as Components from 'pages/home/contents/_components';
import * as Hooks from './hooks';

const DashboardPage = ({
  headerLeftMarginToggle = false,
  headerLeftMargin = 0,
}: {
  headerLeftMarginToggle?: boolean;
  headerLeftMargin?: number;
}) => {
  const { t } = useTranslation();

  const tagsManager = Hooks.useTagsManager();
  const tagMemosManager = Hooks.useSelectedTagMemosManager(
    tagsManager.tags,
    tagsManager.selectedTag
  );

  const [open, setOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<Memo>();
  const [selectedMemoTag, setSelectedMemoTag] = useState<Tag>();
  const [selectedMemoIndex, setSelectedMemoIndex] = useState(0);

  // 클릭한 태그 경로
  const [tagStack, setTagStack] = useState<Tag[]>([]);

  // 자식 태그 리스트에 있는 태그 클릭 시, stack에 추가
  const addTagToStack = (tag: Tag) => {
    setTagStack((prevStack) => [...prevStack, tag]);
    tagsManager.handleTagClick(tag);
  };

  // 모든 메모 태그 클릭 시 수행되는 코드
  const handleAllTags = () => {
    setTagStack([]);
    tagsManager.clickAllTags();
  };

  // tag stack에서 특정 index의 태그 클릭 시 수행되는 코드
  const selectTagAtIndex = (index: number) => {
    setTagStack((prevStack) => prevStack.slice(0, index + 1));
    const tag = tagStack[index];
    tagsManager.handleTagClick(tag);
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
    const isTagMemosEmpty = () => tagMemosManager.taggedMemos.length === 0;
    const hasSingleTaggedMemo = () => tagMemosManager.taggedMemos.length === 1;

    if (isTagMemosEmpty()) {
      return null;
    }

    if (hasSingleTaggedMemo()) {
      const taggedMemo = tagMemosManager.taggedMemos[0];

      return (
        <div className="px-4">
          <Components.MemosList>
            {taggedMemo.memos.map((memo, _) => (
              <Components.UneditableMemo memo={memo} />
            ))}
          </Components.MemosList>
        </div>
      );
    }

    return (
      <div className="flex flex-1 h-full gap-4 overflow-x-scroll">
        {tagMemosManager.taggedMemos.map(({ tag, childTags, memos }) => {
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
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen text-gray2 overflow-hidden px-4">
      <Components.AnimatedHeader
        text={t('pages.dashboard.header')}
        leftMarginToggle={headerLeftMarginToggle}
        leftMargin={headerLeftMargin}
        animationDuration={Constants.SIDEBAR_HEADER_ANIMATION_DURATION}
      />

      <CurrentTagPath
        allTagText={t('pages.dashboard.allMemoButton')}
        tagStack={tagStack}
        onTagClickAtIndex={selectTagAtIndex}
        onAllTagClick={handleAllTags}
        invalidCharsPattern={Constants.TAG_INVALID_CHARS_PATTERN}
      >
        {tagsManager.tags.map((tag, index) => (
          <Components.UneditableTag
            key={index}
            text={tag.name}
            invalidCharsPattern={Constants.TAG_INVALID_CHARS_PATTERN}
            onClick={() => addTagToStack(tag)}
          />
        ))}
      </CurrentTagPath>

      {renderTaggedMemosList()}

      <MemoEditModal
        open={open}
        handleClose={handleClose}
        selectedMemo={selectedMemo}
        selectedMemoTag={selectedMemoTag}
        selectedMemoIndex={selectedMemoIndex}
        updateViewMemo={tagMemosManager.updateViewMemo}
        deleteViewMemo={tagMemosManager.deleteViewMemo}
        revertViewMemo={tagMemosManager.revertViewMemo}
      />
    </div>
  );
};

export default DashboardPage;
