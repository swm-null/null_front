import {
  AnimatedHeader,
  UnEditableTag,
} from 'pages/home/contents/@components/ui';
import { SelectedTagMemosList } from './components';
import useSelectedTagMemosManager from './hook/useSelectedTagMemosManager';
import {
  SIDEBAR_HEADER_ANIMATION_DURATION,
  TAG_INVALID_CHARS_PATTERN,
} from 'pages/home/constants';
import { EditableMemo as SelectedTagMemo } from 'pages/home/contents/@components';
import { useTranslation } from 'react-i18next';
import { TagList } from './components/TagList';

export const DashboardPage = ({
  headerLeftMarginToggle = false,
  headerLeftMargin = 0,
}: {
  headerLeftMarginToggle?: boolean;
  headerLeftMargin?: number;
}) => {
  const { t } = useTranslation();
  const { viewMemos, tags, handleTagClick, clickAllTags } =
    useSelectedTagMemosManager();

  // TODO: api 연동하는 코드 추가하기
  // 위치는 여기에 할지, EditableMemo 할지 고민 더 해보기
  const updateMemo = () => {
    console.log('updateMemo api 연동 예정');
  };

  // TODO: api 연동하는 코드 추가하기
  const deleteMemo = () => {
    console.log('deleteMemo api 연동 예정');
  };

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
          <UnEditableTag
            key={index}
            text={tag.name}
            invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
            onClick={() => handleTagClick(tag.name)}
          />
        ))}
      </TagList>

      <div className="pb-4 px-4 flex flex-col flex-1 overflow-hidden">
        <SelectedTagMemosList>
          {viewMemos.map((memo) => (
            <SelectedTagMemo
              editable
              key={memo.id}
              memo={memo}
              updateMemo={updateMemo}
              deleteMemo={deleteMemo}
            />
          ))}
        </SelectedTagMemosList>
      </div>
    </div>
  );
};
