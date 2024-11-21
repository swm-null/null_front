import { Menu, MenuItem, Divider } from '@mui/material';
import { profile } from 'api';
import { useTranslation } from 'react-i18next';

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  userProfile: profile | null;
  onEditProfile: () => void;
  onUploadData: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
}

const ProfileMenu = ({
  anchorEl,
  onClose,
  userProfile,
  onEditProfile,
  onUploadData,
  onDeleteAccount,
  onLogout,
}: ProfileMenuProps) => {
  const { t } = useTranslation();

  const handleHowToUse = () => {
    window.open(
      'https://heady-card-402.notion.site/Oatnote-145feb7f17f58049ac6af16c7959556c?pvs=74',
      '_blank',
      'noopener, noreferrer'
    );
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      sx={{ '& .MuiList-root': { marginBottom: 0, paddingBottom: 0 } }}
    >
      {userProfile && [
        <MenuItem key="profile-info" sx={{ pointerEvents: 'none' }}>
          <div className="flex flex-col gap-2">
            <p className="w-full">{userProfile.name}</p>
            <p className="w-full">{userProfile.email}</p>
          </div>
        </MenuItem>,
        <Divider key="divider" />,
      ]}
      <MenuItem onClick={onEditProfile}>{t('profile.editProfile')}</MenuItem>
      <MenuItem onClick={handleHowToUse}>Oatnote는 어떻게 쓰나요?</MenuItem>
      <MenuItem onClick={onUploadData}>{t('profile.uploadDataButton')}</MenuItem>
      <Divider />
      <MenuItem onClick={onDeleteAccount} sx={{ marginBottom: 1 }}>
        {t('profile.deleteAccountButton')}
      </MenuItem>
      <MenuItem
        onClick={onLogout}
        sx={{
          paddingTop: 1.3,
          paddingBottom: 1.3,
          backgroundColor: '#EFEFEF',
          '&:hover': {
            backgroundColor: '#DCDDDC',
          },
        }}
      >
        <p className="w-full text-center">{t('profile.logoutButton')}</p>
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
