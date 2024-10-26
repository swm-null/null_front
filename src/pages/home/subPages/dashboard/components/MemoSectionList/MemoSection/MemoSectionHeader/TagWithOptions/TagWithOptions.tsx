import { deleteTag, isValidResponse } from 'api';
import { DeleteIcon, EditIcon } from 'assets/icons';
import { useClickWithoutDrag } from 'pages/home/subPages/hooks';
import { Tag } from 'pages/home/subPages/interfaces';
import { FunctionComponent, SVGProps, useContext } from 'react';
import { AlertContext } from 'utils';
import { DashboardModalContext } from 'utils';

const TagWithOptions = ({ tag }: { tag: Tag }) => {
  const { openTagEditModal } = useContext(DashboardModalContext);
  const { alert, confirmAlert } = useContext(AlertContext);

  const handleDeleteTag = async () => {
    const confirmed = confirmAlert('정말 삭제하시겠습니까?');

    if (!confirmed) return;

    try {
      const response = await deleteTag(tag.id);
      if (!isValidResponse(response)) {
        alert(response.exceptionMessage);
      }
    } catch (error) {
      alert('다시 시도해주세요');
    }
  };

  return (
    <>
      <p className="text-[#3e3e3e]">{tag.name}</p>
      <div className="flex gap-1">
        <IconWrapper
          IconComponent={EditIcon}
          handleStaticClick={() => openTagEditModal(tag)}
        />
        <IconWrapper
          IconComponent={DeleteIcon}
          handleStaticClick={handleDeleteTag}
        />
      </div>
    </>
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
      className="text-brown0"
    />
  );
};

export default TagWithOptions;
