import { Avatar, IconButton } from '@mui/material';
import { oatmealUrl } from 'assets/images';
import { ProfileEditModal } from './ProfileEditModal';
import { useProfileEditModalManager, useProfileManager } from './hooks';
import { ProfileMenu } from './ProfileMenu';

const ProfileButton = () => {
  const profileManager = useProfileManager();
  const profileEditModalManager = useProfileEditModalManager();

  return (
    <>
      <IconButton
        className="w-10 h-10"
        onClick={profileEditModalManager.handleMenuClick}
      >
        <Avatar
          className="border-2 border-white shadow-custom"
          alt="Profile"
          src={profileManager.userProfile?.profileImageUrl || oatmealUrl}
        />
      </IconButton>

      <ProfileMenu
        anchorEl={profileEditModalManager.anchorEl}
        userProfile={profileManager.userProfile}
        onClose={profileEditModalManager.handleMenuClose}
        onEditProfile={profileEditModalManager.handleProfileEditModalOpen}
        onDeleteAccount={profileManager.handleDeleteAccount}
        onLogout={profileManager.handleLogout}
      />

      {profileManager.userProfile && (
        <ProfileEditModal
          isOpen={profileEditModalManager.editModalOpen}
          handleClose={profileEditModalManager.handleProfileEditModalClose}
          userProfile={profileManager.userProfile}
          onSave={(newName, newImage) =>
            profileManager.handleSave(
              newName,
              newImage,
              profileEditModalManager.handleProfileEditModalClose
            )
          }
        />
      )}
    </>
  );
};

export default ProfileButton;
