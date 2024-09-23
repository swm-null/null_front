import { AddIcon, SearchIcon } from 'assets/icons';
import { Mode } from 'pages/home/contents/_interfaces';
import { useTranslation } from 'react-i18next';

interface ModeToggleProps {
  mode: Mode;
  onModeChange: (newMode: Mode) => void;
}

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 mb-4">
      <ModeToggleButton
        selected={mode === 'search'}
        icon={<SearchIcon className="w-5 h-5 my-[6px] mr-1" />}
        onModeChange={() => onModeChange('search')}
        text={t('pages.main.mode.search')}
      />
      <ModeToggleButton
        selected={mode === 'create'}
        icon={<AddIcon className="ml-1 mr-2" />}
        onModeChange={() => onModeChange('create')}
        text={t('pages.main.mode.create')}
      />
    </div>
  );
};

interface ModeToggleButtonProps {
  selected: boolean;
  icon: React.ReactNode;
  onModeChange: () => void;
  text: string;
}

const ModeToggleButton = ({
  selected,
  icon,
  onModeChange,
  text,
}: ModeToggleButtonProps) => (
  <button
    onClick={onModeChange}
    className={` py-1 px-4 rounded-full inline-flex items-center border-[1px] border-[#E3BFA4] cursor-pointer 
          ${selected ? 'bg-[#FFF6E3] text-[#6A5344]' : 'bg-[#F4CDB1] text-[#846E62]'} `}
  >
    {icon}
    {text}
  </button>
);

export default ModeToggle;
