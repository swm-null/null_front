import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { Header } from 'pages/home/subPages/components';
import * as Components from './components';
import * as Constants from 'pages/home/constants';
import * as Hooks from './hooks';
import { SortOption } from './interfaces';

const DashboardPage = ({}: {}) => {
  const { t } = useTranslation();

  const [sortOption, setSortOption] = useState<SortOption>('LATEST');
  const [tagStack, setTagStack] = useState<Tag[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<Memo>();
  const [selectedMemoTag, setSelectedMemoTag] = useState<Tag | null>();
  const [selectedMemoIndex, setSelectedMemoIndex] = useState(0);

  const tagsManager = Hooks.useTagsManager();
  const tagMemosManager = Hooks.useSelectedTagMemosManager(
    tagsManager.selectedTag,
    sortOption
  );

  const handleChildTagClick = (tag: Tag | null) => {
    setTagStack((prevStack) =>
      [...prevStack, tag].filter((tag) => tag !== null)
    );
    tagsManager.handleTagOrAllTagsClick(tag);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMemo(undefined);
  };

  const handleMemoClickAndOpenModal = (
    memo: Memo,
    tag: Tag | null,
    index: number
  ) => {
    setModalOpen(true);
    setSelectedMemo(memo);
    setSelectedMemoTag(tag);
    setSelectedMemoIndex(index);
  };

  return (
    <div className="flex flex-col h-full bg-custom-gradient-basic text-gray2 overflow-hidden px-4 pb-4">
      <div className="w-full h-full pt-12 pb-8 flex flex-col max-w-[1102px] self-center gap-4">
        <Header headerText={t('pages.dashboard.header')} />
        <div className="flex flex-col flex-1 gap-[0.9rem] overflow-hidden">
          <Components.CurrentTagPath
            allTagText={t('pages.dashboard.allMemoButton')}
            tags={tagMemosManager.tags}
            tagStack={tagStack}
            setTagStack={setTagStack}
            sortOption={sortOption}
            setSortOption={setSortOption}
            handleTagOrAllTagsClick={tagsManager.handleTagOrAllTagsClick}
            handleChildTagClick={handleChildTagClick}
            invalidCharsPattern={Constants.TAG_INVALID_CHARS_PATTERN}
          />
          <Components.MemoSectionList
            parentTag={tagsManager.selectedTag}
            memoSectionListData={tagMemosManager.memoSectionListByTag}
            addTagToStack={handleChildTagClick}
            handleMemoClick={handleMemoClickAndOpenModal}
            fetchNextPage={tagMemosManager.fetchNextPage}
            fetchNextPageForChildTag={tagMemosManager.fetchNextPageForChildTag}
          />
        </div>
      </div>

      <Components.MemoEditModal
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
