import { useContext } from 'react';
import { AlertContext, ImageListContext } from 'utils/context';
import Cookies from 'js-cookie';
import * as Api from 'api';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useValidationManager } from 'pages/hooks';

const useProfileManager = () => {
  const { t } = useTranslation();
  const { alert, confirmAlert } = useContext(AlertContext);
  const { images } = useContext(ImageListContext);
  const { validateName } = useValidationManager();

  const queryClient = useQueryClient();

  const { data: userProfile, refetch: refetchProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await Api.getUserProfile();
      if (Api.isProfileResponse(response)) {
        return {
          email: response.email,
          name: response.name,
          profileImageUrl: response.profileImageUrl,
        };
      }
      throw new Error('Failed to fetch profile');
    },
  });

  const handleSave = async (
    newName: string,
    newImage: string | null,
    handleModalClose: () => void
  ) => {
    if (newName === userProfile?.name && !newImage) {
      handleModalClose();
      return;
    }

    const errorMessage = validateName(newName);
    if (errorMessage) {
      await alert(errorMessage);
      return;
    }

    queryClient.setQueryData(['userProfile'], {
      ...userProfile,
      name: newName,
      profileImageUrl: newImage || userProfile?.profileImageUrl || null,
    });

    try {
      if (!userProfile) return null;

      const imageUrl = await getImageUrl(images);
      const response = await Api.editUserProfile(
        userProfile.email,
        newName,
        imageUrl ? imageUrl : userProfile.profileImageUrl
      );

      if (Api.isProfileResponse(response)) {
        refetchProfile();
        handleModalClose();
      } else {
        throw new Error('profile update failed');
      }
    } catch (error) {
      await alert(t('profile.profileEditFailed'));
      refetchProfile();
    }
  };

  const getImageUrl = async (images: File[]): Promise<string | null> => {
    if (images.length === 0) return null;
    const response = await Api.uploadFile(images[0]);
    if (!Api.isFilesResponse(response))
      throw new Error('파일 업로드에 문제가 생겼습니다.');
    return response.urls[0];
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirmAlert(t('profile.accountDeletionConfirmation'));
    if (!confirmed) {
      return;
    }

    try {
      const response = await Api.deleteUserAccount();
      if (Api.isValidResponse(response)) {
        await alert(t('profile.accountDeleted'));
        Cookies.remove('refresh_token');
        Cookies.remove('access_token');
        window.location.href = '/login';
      } else {
        await alert(t('profile.accountDeleteFailed'));
      }
    } catch (error) {
      await alert(t('profile.accountDeleteFailed'));
    }
  };

  const handleLogout = () => {
    Cookies.remove('refresh_token');
    Cookies.remove('access_token');
    window.location.href = '/login';
  };

  return {
    userProfile: userProfile ? userProfile : null,
    handleSave,
    handleDeleteAccount,
    handleLogout,
  };
};

export default useProfileManager;
