import { useTranslation } from 'react-i18next';
import {
  SIDEBAR_HEADER_ANIMATION_DURATION,
  TAG_INVALID_CHARS_PATTERN,
} from 'pages/home/constants';
import {
  AnimatedHeader,
  UneditableTag,
  EditableMemo as SelectedTagMemo,
} from 'pages/home/contents/@components';
import { SelectedTagMemosList, TagList } from './components';
import { useSelectedTagMemosManager } from './hook';

const DashboardPage = ({
  headerLeftMarginToggle = false,
  headerLeftMargin = 0,
}: {
  headerLeftMarginToggle?: boolean;
  headerLeftMargin?: number;
}) => {
  const { t } = useTranslation();
  const {
    viewMemos,
    tags,
    handleTagClick,
    clickAllTags,
    updateViewMemo,
    deleteViewMemo,
    revertViewMemo,
  } = useSelectedTagMemosManager();

  return (
    <div className="flex flex-col flex-1 h-screen text-gray2">
      <AnimatedHeader
        text={t('pages.dashboard.header')}
        leftMarginToggle={headerLeftMarginToggle}
        leftMargin={headerLeftMargin}
        animationDuration={SIDEBAR_HEADER_ANIMATION_DURATION}
      />

      {/* tag들 선택하는 부분 */}
      <TagList
        allTagText={t('pages.dashboard.allMemoButton')}
        handleAllTagClick={clickAllTags}
        invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
      >
        {tags.map((tag, index) => (
          <UneditableTag
            key={index}
            text={tag.name}
            invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
            onClick={() => handleTagClick(tag.name)}
          />
        ))}
      </TagList>

      <div className="pb-4 px-4 flex flex-col flex-1 overflow-hidden">
        <SelectedTagMemosList>
          {viewMemos.map((memo, index) => (
            <SelectedTagMemo
              editable
              key={memo.id}
              memo={memo}
              softUpdateMemo={updateViewMemo}
              softDeleteMemo={deleteViewMemo}
              softRevertMemo={(memo) => revertViewMemo(index, memo)}
            />
          ))}
        </SelectedTagMemosList>
      </div>
    </div>
  );
};

export default DashboardPage;
