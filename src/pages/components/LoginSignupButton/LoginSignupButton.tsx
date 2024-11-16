interface LoginSignupButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  additionalClasses?: string;
  disabled?: boolean;
}

const LoginSignupButton = ({
  label,
  onClick,
  type = 'button',
  additionalClasses = '',
  disabled = false,
}: LoginSignupButtonProps) => {
  const hoverColor = '#F2BBA0';
  const bgColor = '#F4CDB1';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-2 rounded-lg focus:outline-none ${additionalClasses} 
        bg-[#F4CDB1] border border-black border-opacity-10 bg-clip-padding text-[#6A5344]
        ${disabled ? 'opacity-50' : ''}`}
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
