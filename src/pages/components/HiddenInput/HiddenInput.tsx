import { CustomInput } from '../CustomInput';

const HiddenInput = ({
  label,
  value,
  setValue,
  error,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  error?: { flag: boolean; message: string };
}) => {
  return (
    <CustomInput
      label={label}
      value={value}
      setValue={setValue}
      hidden
      useHiddenToggle
      error={error}
    />
  );
};

export default HiddenInput;
