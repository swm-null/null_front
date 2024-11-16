import { Avatar, IconButton } from '@mui/material';
import { oatmealUrl } from 'assets/images';
import { ProfileEditModal } from './ProfileEditModal';
import { useProfileMenuManager, useProfileManager } from './hooks';
import { ProfileMenu } from './ProfileMenu';
import { useState } from 'react';
import UploadDataModal from './UploadDataModal/UploadDataModal';

const ProfileButton = () => {
  const profileManager = useProfileManager();
  const profileMenuManager = useProfileMenuManager();

  const [isUploadDataModalOpen, setIsUploadDataModalOpen] = useState(false);

  const handleUploadData = () => {
    setIsUploadDataModalOpen(true);
  };

  const handleCloseUploadData = () => {
    setIsUploadDataModalOpen(false);
  };

  return (
    <>
      <IconButton className="w-10 h-10" onClick={profileMenuManager.handleMenuClick}>
        <Avatar
          className="border-2 border-white shadow-custom"
          alt="Profile"
          src={profileManager.userProfile?.profileImageUrl || oatmealUrl}
        />
      </IconButton>

      <ProfileMenu
        anchorEl={profileMenuManager.anchorEl}
        userProfile={profileManager.userProfile}
        onClose={profileMenuManager.handleMenuClose}
        onEditProfile={profileMenuManager.handleProfileEditModalOpen}
        onUploadData={handleUploadData}
        onDeleteAccount={profileManager.handleDeleteAccount}
        onLogout={profileManager.handleLogout}
      />

      {profileManager.userProfile && (
        <ProfileEditModal
          isOpen={profileMenuManager.editModalOpen}
          handleClose={profileMenuManager.handleProfileEditModalClose}
          userProfile={profileManager.userProfile}
          onSave={(newName, newImage) =>
            profileManager.handleSave(
              newName,
              newImage,
              profileMenuManager.handleProfileEditModalClose
            )
          }
        />
      )}
      {isUploadDataModalOpen && (
        <UploadDataModal
          email={profileManager.userProfile?.email || null}
          isOpen={isUploadDataModalOpen}
          handleClose={handleCloseUploadData}
        />
      )}
    </>
  );
};

export default ProfileButton;
