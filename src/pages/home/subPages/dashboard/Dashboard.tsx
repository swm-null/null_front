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

  const tagsManager = Hooks.useDashboardTagManager();

  const handleChildTagClick = (tag: Tag | null) => {
    if (tag) {
      setTagStack((prevStack) => [...prevStack, tag]);
    }
    tagsManager.handleTagOrAllTagsClick(tag);
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
            tags={tagsManager.childTags}
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

      <Components.TagEditModal />
      <Components.MemoEditModal />
    </div>
  );
};

export default DashboardPage;
