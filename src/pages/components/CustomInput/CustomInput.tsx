const CustomInput = ({
  label,
  value,
  setValue,
  hidden = false,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  hidden?: boolean;
}) => {
  return (
    <>
      <p className="block mb-2 text-sm font-medium text-gray-700">{label}</p>
      <input
        type={hidden ? 'password' : 'text'}
        id={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </>
  );
};

export default CustomInput;
