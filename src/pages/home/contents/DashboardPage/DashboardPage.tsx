import { useState } from 'react';
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
import { SelectedTagMemosList, CurrentTagPath } from './components';
import { useSelectedTagMemosManager, useTagsManager } from './hook';
import { Tag } from '../@interfaces';

const DashboardPage = ({
  headerLeftMarginToggle = false,
  headerLeftMargin = 0,
}: {
  headerLeftMarginToggle?: boolean;
  headerLeftMargin?: number;
}) => {
  const { t } = useTranslation();

  const { tags, selectedTag, handleTagClick, clickAllTags } = useTagsManager();

  const { viewMemos, updateViewMemo, deleteViewMemo, revertViewMemo } =
    useSelectedTagMemosManager(selectedTag);

  // 클릭한 태그 경로
  const [tagStack, setTagStack] = useState<Tag[]>([]);

  // 자식 태그 리스트에 있는 태그 클릭 시, stack에 추가
  const addTagToStack = (tag: Tag) => {
    setTagStack((prevStack) => [...prevStack, tag]);
    handleTagClick(tag);
  };

  // 모든 메모 태그 클릭 시 수행되는 코드
  const handleAllTags = () => {
    setTagStack([]);
    clickAllTags();
  };

  // tag stack에서 특정 index의 태그 클릭 시 수행되는 코드
  const selectTagAtIndex = (index: number) => {
    setTagStack((prevStack) => prevStack.slice(0, index + 1));
    const tag = tagStack[index];
    handleTagClick(tag);
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
      <CurrentTagPath
        allTagText={t('pages.dashboard.allMemoButton')}
        tagStack={tagStack}
        onTagClickAtIndex={selectTagAtIndex}
        onAllTagClick={handleAllTags}
        invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
      >
        {tags.map((tag, index) => (
          <UneditableTag
            key={index}
            text={tag.name}
            invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
            onClick={() => addTagToStack(tag)}
          />
        ))}
      </CurrentTagPath>

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
