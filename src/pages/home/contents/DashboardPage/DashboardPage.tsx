import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Memo, Tag } from 'pages/home/contents/_interfaces';
import { CurrentTagPath, MemoEditModal, MemoSectionList } from './components';
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

  const [modalOpen, setModalOpen] = useState(false);
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

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMemo(undefined);
  };

  const handleMemoClickAndOpenModal = (memo: Memo, tag: Tag, index: number) => {
    setModalOpen(true);
    setSelectedMemo(memo);
    setSelectedMemoTag(tag);
    setSelectedMemoIndex(index);
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

      <MemoSectionList
        memoSectionListData={tagMemosManager.taggedMemos}
        addTagToStack={addTagToStack}
        handleMemoClick={handleMemoClickAndOpenModal}
      />

      <MemoEditModal
        open={modalOpen}
        handleClose={handleModalClose}
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
