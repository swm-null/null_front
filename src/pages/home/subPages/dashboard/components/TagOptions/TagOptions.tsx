import { paginationDashboardTagRelations } from 'api';
import { DeleteIcon, EditIcon } from 'assets/icons';
import { useTagManager } from 'pages/home/subPages/components';
import { useClickWithoutDrag } from 'pages/hooks';
import { Tag } from 'pages/home/subPages/interfaces';
import { FunctionComponent, SVGProps, useContext } from 'react';
import { TagContext } from 'utils';

export interface InfiniteQueryData {
  pages: paginationDashboardTagRelations[];
  pageParams: number[];
}

const TagWithOptions = ({ tag }: { tag: Tag }) => {
  const { openTagEditModal } = useContext(TagContext);
  const { handleDeleteTag } = useTagManager();

  return (
    <div className="flex gap-1">
      <IconWrapper
        IconComponent={EditIcon}
        handleStaticClick={() => openTagEditModal(tag)}
      />
      <IconWrapper
        IconComponent={DeleteIcon}
        handleStaticClick={() => handleDeleteTag(tag)}
      />
    </div>
  );
};

const IconWrapper = ({
  IconComponent,
  handleStaticClick,
}: {
  IconComponent: FunctionComponent<
    SVGProps<SVGSVGElement> & {
      title?: string;
    }
  >;
  handleStaticClick: () => void;
}) => {
  const { handleMouseDown, handleMouseMove, handleClick } =
    useClickWithoutDrag(handleStaticClick);

  return (
    <IconComponent
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      width="1.125rem"
      height="1.125rem"
      className="text-brown0 cursor-pointer self-center"
    />
  );
};

export default TagWithOptions;
