import { Checkbox } from '@mui/material';
import { CheckedIcon, NotCheckedIcon } from 'assets/icons';
import { useTranslation } from 'react-i18next';

const TagRebuildCheckBox = ({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: (checked: boolean) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-[0.62rem] items-center">
      <Checkbox
        className="w-5 h-5"
        checked={checked}
        onClick={() => {
          setChecked(!checked);
        }}
        disableRipple
        icon={<NotCheckedIcon />}
        checkedIcon={<CheckedIcon />}
        sx={{ padding: 0 }}
      />
      <p className="text-brown2 font-medium text-sm">{t('memo.tagRebuild')}</p>
    </div>
  );
};

export default TagRebuildCheckBox;
