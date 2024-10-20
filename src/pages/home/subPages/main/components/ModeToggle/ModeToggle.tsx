import { AddIcon, SearchIcon } from 'assets/icons';
import { useTranslation } from 'react-i18next';
import { Mode } from '../../interfaces';

interface ModeToggleProps {
  mode: Mode;
  onModeChange: (newMode: Mode) => void;
}

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 mx-4">
      <ModeButton
        selected={mode === 'create'}
        icon={<AddIcon className="ml-1 mr-2" />}
        onModeChange={() => onModeChange('create')}
        text={t('pages.main.mode.create')}
      />
      <ModeButton
        selected={mode === 'search'}
        icon={<SearchIcon className="w-5 h-5 my-[6px] mr-1" />}
        onModeChange={() => onModeChange('search')}
        text={t('pages.main.mode.search')}
      />
    </div>
  );
};

interface ModeButtonProps {
  selected: boolean;
  icon: React.ReactNode;
  onModeChange: () => void;
  text: string;
}

const ModeButton = ({
  selected,
  icon,
  onModeChange,
  text,
}: ModeButtonProps) => (
  <button
    type="button"
    onClick={onModeChange}
    className={`py-1 px-4 rounded-full inline-flex items-center border font-bold 
      border-black border-opacity-10 bg-clip-padding cursor-pointer 
      ${selected ? 'bg-[#FFF6E3] text-[#6A5344]' : 'bg-[#F4CDB1] text-[#846E62]'} `}
  >
    {icon}
    {text}
  </button>
);

export default ModeToggle;
