import { CustomInput } from '../CustomInput';

const HiddenInput = ({
  label,
  value,
  setValue,
  errorMessage = '',
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  errorMessage?: string;
}) => {
  return (
    <CustomInput
      label={label}
      value={value}
      setValue={setValue}
      hidden
      useHiddenToggle
      errorMessage={errorMessage}
    />
  );
};

export default HiddenInput;
