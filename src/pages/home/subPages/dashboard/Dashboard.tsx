import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
import { Header } from 'pages/home/subPages/components';
import * as Components from './components';
import * as Constants from 'pages/home/constants';
import * as Hooks from './hooks';

const DashboardPage = ({}: {}) => {
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
    <div className="flex flex-col h-full bg-custom-gradient-basic text-gray2 overflow-hidden px-4 pb-4">
      <div className="w-full h-full pt-12 pb-8 flex flex-col max-w-[1102px] self-center">
        <Header headerText={t('pages.dashboard.header')} />
        <div className="flex flex-col flex-1 gap-[0.9rem] overflow-hidden">
          <Components.CurrentTagPath
            allTagText={t('pages.dashboard.allMemoButton')}
            tags={tagsManager.tags}
            tagStack={tagStack}
            setTagStack={setTagStack}
            handleTagOrAllTagsClick={tagsManager.handleTagOrAllTagsClick}
            handleChildTagClick={handleChildTagClick}
            invalidCharsPattern={Constants.TAG_INVALID_CHARS_PATTERN}
          />
          <Components.MemoSectionList
            memoSectionListData={tagMemosManager.memoSectionListByTag}
            addTagToStack={handleChildTagClick}
            handleMemoClick={handleMemoClickAndOpenModal}
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
