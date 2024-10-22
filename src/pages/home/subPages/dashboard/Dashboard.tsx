import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Memo, Tag } from 'pages/home/subPages/interfaces';
import * as Components from './components';
import * as Constants from 'pages/home/constants';
import * as Hooks from './hooks';
import { SortOption } from './interfaces';
import { BottomNavContext } from 'utils';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { isSmallScreen, bottomNavHeight } = useContext(BottomNavContext);

  const [sortOption, setSortOption] = useState<SortOption>('LATEST');
  const [tagStack, setTagStack] = useState<Tag[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<Memo>();
  const [selectedMemoTag, setSelectedMemoTag] = useState<Tag | null>();
  const [selectedMemoIndex, setSelectedMemoIndex] = useState(0);

  const tagsManager = Hooks.useTagsManager();

  const handleChildTagClick = (tag: Tag | null) => {
    if (tag) {
      setTagStack((prevStack) => [...prevStack, tag]);
    }
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

  const updateMemoFromMemoSectionList = (_memo: Memo) => {
    // TODO: 여기서 모든 섹션마다 해당 메모를 찾아서 업데이트 해주는 코드 들어가야함
  };

  const deleteMemoFromMemoSectionList = (_memoId: string) => {
    // TODO: 여기서 모든 섹션마다 해당 메모를 찾아서 삭제 해주는 코드 들어가야함
  };

  const revertMemoFromMemoSectionList = (_memo: Memo) => {
    // TODO: 여기서 모든 섹션마다 해당 메모를 찾아서 잘못 삭제, 업데이트한 것을 복구 해주는 코드 들어가야함
  };

  return (
    <div
      className="flex flex-col h-full text-gray2 overflow-hidden"
      style={{ paddingBottom: isSmallScreen ? bottomNavHeight + 8 : 0 }}
    >
      <div className="w-full h-full flex flex-col max-w-[1102px] self-center gap-4">
        <div className="flex flex-col flex-1 gap-[0.9rem] overflow-hidden">
          <Components.CurrentTagPath
            allTagText={t('pages.dashboard.allMemoButton')}
            tags={tagsManager.tagRelations.flatMap((tagRelation) => tagRelation.tag)}
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
            tagRelations={tagsManager.tagRelations}
            sortOption={sortOption}
            addTagToStack={handleChildTagClick}
            handleMemoClick={handleMemoClickAndOpenModal}
            fetchNextPage={tagsManager.fetchNextPage}
          />
        </div>
      </div>

      <Components.MemoEditModal
        open={modalOpen}
        handleClose={handleModalClose}
        selectedMemo={selectedMemo}
        selectedMemoTag={selectedMemoTag}
        selectedMemoIndex={selectedMemoIndex}
        updateMemo={updateMemoFromMemoSectionList}
        deleteMemo={deleteMemoFromMemoSectionList}
        revertMemo={revertMemoFromMemoSectionList}
      />
    </div>
  );
};

export default DashboardPage;
