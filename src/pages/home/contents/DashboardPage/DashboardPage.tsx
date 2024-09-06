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

  const [tagStack, setTagStack] = useState<Tag[]>([]);

  const handleChildTagClick = (tag: Tag) => {
    setTagStack((prevStack) => [...prevStack, tag]);
    tagsManager.handleTagOrAllTagsClick(tag);
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
        tags={tagsManager.tags}
        tagStack={tagStack}
        setTagStack={setTagStack}
        handleTagOrAllTagsClick={tagsManager.handleTagOrAllTagsClick}
        handleChildTagClick={handleChildTagClick}
        invalidCharsPattern={Constants.TAG_INVALID_CHARS_PATTERN}
      />

      <MemoSectionList
        memoSectionListData={tagMemosManager.memoSectionListByTag}
        addTagToStack={handleChildTagClick}
        handleMemoClick={handleMemoClickAndOpenModal}
      />

      <MemoEditModal
        open={modalOpen}
        handleClose={handleModalClose}
        selectedMemo={selectedMemo}
        selectedMemoTag={selectedMemoTag}
        selectedMemoIndex={selectedMemoIndex}
        updateMemo={tagMemosManager.updateMemoFromMemoSectionListByTag}
        deleteMemo={tagMemosManager.deleteMemoFromMemoSectionListByTag}
        revertMemo={tagMemosManager.revertMemoFromMemoSectionListByTag}
      />
    </div>
  );
};

export default DashboardPage;
