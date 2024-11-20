import { TAG_INVALID_CHARS_PATTERN } from 'pages/home/constants';
import { Tag } from 'pages/home/subPages/interfaces';
import { RightIcon } from 'assets/icons';
import { useClickWithoutDrag } from 'pages/hooks';
import { TagOptions } from 'pages/home/subPages/dashboard/components';
import { UneditableTagList } from 'pages/home/subPages/components';
import { useTranslation } from 'react-i18next';

interface MemoSectionHeaderProps {
  tag: Tag;
  childTags: Tag[];
  isLinked: boolean;
  isLeaf: boolean;
  handleTagClick?: () => void;
}

const MemoSectionHeader = ({
  tag,
  childTags,
  isLinked,
  isLeaf,
  handleTagClick,
}: MemoSectionHeaderProps) => {
  const { t } = useTranslation();
  const { handleMouseDown, handleMouseMove, handleClick } = useClickWithoutDrag(
    handleTagClick ? handleTagClick : () => {}
  );

  return (
    // FIXME: 일단 width 때러박고 나중에, css 만질때 수정하기
    <div
      className={`flex flex-col px-3 py-4  gap-4 w-[268px] bg-[#FFF6E380] ${isLinked ? '' : 'cursor-pointer'}`}
      {...(!isLinked && {
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onClick: handleClick,
      })}
    >
      <div className="flex w-full items-center gap-3">
        <p className="text-[#3e3e3e]">{tag.name}</p>
        {!isLinked && !isLeaf && <TagOptions tag={tag} />}
        <div className="ml-auto flex items-center ">
          {!isLinked && !isLeaf && <RightIcon color="black" />}
        </div>
      </div>
      <div className="flex overflow-hidden">
        {childTags.length > 0 ? (
          <UneditableTagList
            tags={childTags}
            size="medium"
            color="white"
            borderOpacity={5}
            invalidCharsPattern={TAG_INVALID_CHARS_PATTERN}
          />
        ) : (
          <div className="h-6">
            {isLinked && (
              <p className="text-xs select-none">
                {t('pages.dashboard.tag.linkedTag')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoSectionHeader;
