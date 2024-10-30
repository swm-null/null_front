import { useState, useContext, useEffect } from 'react';
import { Menu, MenuItem, Avatar, IconButton, Divider } from '@mui/material';
import Cookies from 'js-cookie';
import { AlertContext } from 'utils/context';
import * as Api from 'api';
import { useTranslation } from 'react-i18next';
import { oatmealUrl } from 'assets/images';

const ProfileButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { alert, confirmAlert } = useContext(AlertContext);
  const [userProfile, setUserProfile] = useState<Api.profile | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await Api.getUserProfile();
        if (Api.isProfileResponse(response)) {
          setUserProfile({
            email: response.email,
            name: response.name,
            profileImageUrl: response.profileImageUrl,
          });
        }
      } catch (error) {}
    };

    fetchUserProfile();
  }, [alert, t]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove('refresh_token');
    Cookies.remove('access_token');
    handleClose();
    window.location.href = '/login';
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirmAlert(t('profile.accountDeletionConfirmation'));

    if (!confirmed) {
      handleClose();
      return;
    }

    try {
      const response = await Api.deleteUserAccount();

      if (Api.isValidResponse(response)) {
        await alert(t('profile.accountDeleted'));
        Cookies.remove('refresh_token');
        Cookies.remove('access_token');
        handleClose();
        window.location.href = '/login';
      } else {
        await alert(t('profile.accountDeleteFailed'));
        handleClose();
      }
    } catch (error) {
      await alert(t('profile.accountDeleteFailed'));
      handleClose();
    }
  };

  return (
    <>
      <IconButton className="w-10 h-10" onClick={handleClick}>
        <Avatar
          className=" border-2 border-white shadow-custom"
          alt="Profile"
          src={userProfile?.profileImageUrl || oatmealUrl}
        />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ '& .MuiList-root': { marginBottom: 0, paddingBottom: 0 } }}
      >
        {userProfile && (
          <>
            <MenuItem sx={{ pointerEvents: 'none' }}>
              <div className="flex flex-col gap-2">
                <p className="w-full">{userProfile.name}</p>
                <p className="w-full">{userProfile.email}</p>
              </div>
            </MenuItem>
            <Divider />
          </>
        )}
        <MenuItem onClick={handleDeleteAccount} sx={{ marginBottom: 1 }}>
          {t('profile.deleteAccountButton')}
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
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
    </>
  );
};

export default ProfileButton;
