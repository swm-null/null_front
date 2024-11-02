import { useState } from 'react';

const useProfileMenuManager = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileEditModalOpen = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleProfileEditModalClose = () => {
    setEditModalOpen(false);
  };

  return {
    anchorEl,
    editModalOpen,
    handleMenuClick,
    handleMenuClose,
    handleProfileEditModalOpen,
    handleProfileEditModalClose,
  };
};

export default useProfileMenuManager;
