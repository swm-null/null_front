import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag } from 'pages/home/subPages/interfaces';
import * as Components from './components';
import * as Constants from 'pages/home/constants';
import * as Hooks from './hooks';
import { SortOption } from 'pages/home/subPages/types';
import { BottomNavContext } from 'utils';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { isSmallScreen, bottomNavHeight } = useContext(BottomNavContext);

  const [sortOption, setSortOption] = useState<SortOption>('LATEST');
  const [tagStack, setTagStack] = useState<Tag[]>([]);

  const tagsManager = Hooks.useTagsManager();

  const handleChildTagClick = (tag: Tag | null) => {
    if (tag) {
      setTagStack((prevStack) => [...prevStack, tag]);
    }
    tagsManager.handleTagOrAllTagsClick(tag);
  };

  const updateTagFromMemoSectionList = (_tag: Tag) => {
    // TODO: 여기서 모든 섹션마다 해당 태그를 찾아서 업데이트 해주는 코드 들어가야함
  };

  const revertTagFromMemoSectionList = (_tag: Tag) => {
    // TODO: 여기서 모든 섹션마다 해당 태그를 찾아서 잘못 삭제, 업데이트한 것을 복구 해주는 코드 들어가야함
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
            fetchNextPage={tagsManager.fetchNextPage}
          />
        </div>
      </div>

      <Components.TagEditModal
        updateTag={updateTagFromMemoSectionList}
        revertTag={revertTagFromMemoSectionList}
      />
      <Components.MemoEditModal />
    </div>
  );
};

export default DashboardPage;
