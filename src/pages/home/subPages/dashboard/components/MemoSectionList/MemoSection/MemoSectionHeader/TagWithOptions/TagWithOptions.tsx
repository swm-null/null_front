import { deleteTag, isValidResponse } from 'api';
import { DeleteIcon, EditIcon } from 'assets/icons';
import { Tag } from 'pages/home/subPages/interfaces';
import { MouseEvent, useContext } from 'react';
import { AlertContext } from 'utils';
import { DashboardModalContext } from 'utils';

const TagWithOptions = ({ tag }: { tag: Tag }) => {
  const { openTagEditModal } = useContext(DashboardModalContext);
  const { alert, confirmAlert } = useContext(AlertContext);

  const handleDeleteTag = async (e: MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();

    const confirmed = confirmAlert('정말 삭제하시겠습니까?');

    if (!confirmed) return;

    try {
      const response = await deleteTag(tag.id);
      if (!isValidResponse(response)) {
        alert(response.exceptionMessage);
      }
    } catch (error) {
      // FIXME: 무슨 에러가 뜰까... 예상치 못한 에러일 경우
      alert('다시 시도해주세요');
    }
  };

  const openEditModal = (e: MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    openTagEditModal(tag);
  };

  return (
    <>
      <p className="text-[#3e3e3e]">{tag.name}</p>
      <div className="flex gap-1">
        <EditIcon onClick={openEditModal} width="1.125rem" height="1.125rem" />
        <DeleteIcon
          onClick={handleDeleteTag}
          className="text-brown0"
          width="1.125rem"
          height="1.125rem"
        />
      </div>
    </>
  );
};

export default TagWithOptions;
