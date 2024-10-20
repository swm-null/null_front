import { useState, useContext } from 'react';
import { Menu, MenuItem, Avatar, IconButton } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from 'utils/context';
import { isValidResponse, deleteUserAccount } from 'api';
import { useTranslation } from 'react-i18next';
import { oatmealUrl } from 'assets/images';

const ProfileButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { alert, confirmAlert } = useContext(AlertContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

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
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirmAlert(
      t('profile.accountDeletionConfirmation')
    );

    if (!confirmed) {
      handleClose();
      return;
    }

    try {
      const response = await deleteUserAccount();

      if (isValidResponse(response)) {
        await alert(t('profile.accountDeleted'));
        Cookies.remove('refresh_token');
        Cookies.remove('access_token');
        handleClose();
        navigate('/login');
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
    <div className="absolute top-0 right-0 m-4 z-30">
      <IconButton onClick={handleClick}>
        <Avatar
          className="w-10 h-10 border-2 border-white shadow-custom"
          alt="Profile"
          src={oatmealUrl}
        />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleLogout}>{t('profile.logoutButton')}</MenuItem>
        <MenuItem onClick={handleDeleteAccount}>
          {t('profile.deleteAccountButton')}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileButton;
