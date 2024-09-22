import { Mode } from 'pages/home/contents/_interfaces';
import { useTranslation } from 'react-i18next';

interface ModeToggleProps {
  mode: Mode;
  onModeChange: (newMode: Mode) => void;
}

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex space-x-2 my-4">
      <ModeToggleButton
        selected={mode === 'search'}
        onModeChange={() => onModeChange('search')}
        text={t('pages.main.search')}
      />
      <ModeToggleButton
        selected={mode === 'create'}
        onModeChange={() => onModeChange('create')}
        text={t('pages.main.create')}
      />
    </div>
  );
};

interface ModeToggleButtonProps {
  selected: boolean;
  onModeChange: () => void;
  text: string;
}

const ModeToggleButton = ({
  selected,
  onModeChange,
  text,
}: ModeToggleButtonProps) => (
  <button
    onClick={onModeChange}
    className={`rounded-full inline-flex items-center py-2 px-4 border-[1px] border-[#0000001A] cursor-pointer 
          ${selected ? 'bg-[#FFF6E3] text-[#6A5344]' : 'bg-[#F4CDB1] text-[#846E62]'} `}
  >
    {text}
  </button>
);

export default ModeToggle;
