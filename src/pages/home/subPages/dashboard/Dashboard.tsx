import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag } from 'pages/home/subPages/interfaces';
import * as Components from './components';
import * as Constants from 'pages/home/constants';
import * as Hooks from './hooks/useDashboardTagManager';
import { SortOption } from 'pages/home/subPages/types';
import { BottomNavContext, DashboardResetContext, TagContext } from 'utils';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { isSmallScreen, bottomNavHeight } = useContext(BottomNavContext);
  const { selectedTag, tagStack, setTagStack } = useContext(TagContext);
  const { subscribeToReset, unsubscribeFromReset } =
    useContext(DashboardResetContext);

  const [sortOption, setSortOption] = useState<SortOption>('LATEST');

  const tagsManager = Hooks.useDashboardTagManager();

  const handleChildTagClick = (tag: Tag | Tag[] | null) => {
    history.pushState(
      {
        tagStack: tag
          ? Array.isArray(tag)
            ? [...tagStack, ...tag]
            : [...tagStack, tag]
          : [],
      },
      '',
      window.location.href
    );

    if (Array.isArray(tag)) {
      setTagStack((prevStack) => [...prevStack, ...tag]);
    } else if (tag) {
      setTagStack((prevStack) => [...prevStack, tag]);
    }

    tagsManager.handleTagOrAllTagsClick(
      Array.isArray(tag) ? tag[tag.length - 1] : tag
    );
  };

  const handleGoBack = (event: PopStateEvent) => {
    if (event.state) {
      const { tagStack: prevTagStack } = event.state;
      setTagStack(prevTagStack || []);
      tagsManager.handleTagOrAllTagsClick(
        prevTagStack?.length > 0 ? prevTagStack[prevTagStack.length - 1] : null
      );
    }
  };

  useEffect(() => {
    window.addEventListener('popstate', handleGoBack);

    return () => {
      window.removeEventListener('popstate', handleGoBack);
    };
  }, [selectedTag]);

  useEffect(() => {
    const resetTagStack = () => {
      setTagStack([]);
      handleChildTagClick(null);
    };

    subscribeToReset(resetTagStack);

    return () => {
      unsubscribeFromReset(resetTagStack);
    };
  }, []);

  return (
    <div
      className={`flex flex-col h-full text-gray2 overflow-hidden ${isSmallScreen ? '' : 'mb-10 mx-20'}`}
      style={{ paddingBottom: isSmallScreen ? bottomNavHeight + 8 : 0 }}
    >
      <div className="w-full h-full flex flex-col max-w-[1102px] self-center gap-4">
        <div className="flex flex-col flex-1 gap-[0.9rem] overflow-hidden">
          <Components.DashboardHeader
            allTagText={t('pages.dashboard.allMemoButton')}
            tags={tagsManager.childTags}
            sortOption={sortOption}
            setSortOption={setSortOption}
            handleTagOrAllTagsClick={tagsManager.handleTagOrAllTagsClick}
            invalidCharsPattern={Constants.TAG_INVALID_CHARS_PATTERN}
          />
          <Components.MemoSectionList
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
