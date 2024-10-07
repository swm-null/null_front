import { Checkbox } from '@mui/material';
import { CheckedIcon, NotCheckedIcon } from 'assets/icons';

const TagRebuildCheckBox = ({
  checked,
  setChecked,
  label,
}: {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  label: string;
}) => {
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
      <p className="text-brown2 font-medium text-sm">{label}</p>
    </div>
  );
};

export default TagRebuildCheckBox;
