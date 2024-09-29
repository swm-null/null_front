interface LoginSignupButtonProps {
  label: string;
  onClick: () => void;
  bgColor: string;
  hoverColor: string;
  additionalClasses?: string;
  disabled?: boolean;
}

const LoginSignupButton = ({
  label,
  onClick,
  bgColor,
  hoverColor,
  additionalClasses = '',
  disabled = false,
}: LoginSignupButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-2 rounded-lg focus:outline-none ${additionalClasses}
      ${disabled ? 'opacity-50 bg-[#A0A0A0]' : `bg-[${bgColor}]`}`}
      onMouseOver={(e) =>
        !disabled && (e.currentTarget.style.backgroundColor = hoverColor)
      }
      onMouseOut={(e) =>
        !disabled && (e.currentTarget.style.backgroundColor = bgColor)
      }
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default LoginSignupButton;
