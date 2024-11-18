import { useQueryClient } from '@tanstack/react-query';
import * as Api from 'api';
import { useTranslation } from 'react-i18next';
import { Memo } from 'pages/home/subPages/interfaces';
import { useContext } from 'react';
import { AlertContext } from 'utils';

const useDeleteMemoManager = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { alert, confirmAlert } = useContext(AlertContext);

  const handleDeleteMemo = async ({
    memo,
    handlePreProcess,
  }: {
    memo: Memo;
    handlePreProcess?: () => void;
  }) => {
    const confirmed = await confirmAlert(t('memo.delete.alert'));
    if (!confirmed) return;

    handlePreProcess && handlePreProcess();

    const response = await Api.deleteMemo(memo.id);
    if (Api.isValidResponse(response)) {
      queryClient.invalidateQueries({ queryKey: ['childTagMemos'] });
      queryClient.invalidateQueries({ queryKey: ['recentMemo'] });
    } else {
      alert(t('memo.deleteErrorMessage'));
    }
  };

  return {
    handleDeleteMemo,
  };
};

export default useDeleteMemoManager;
