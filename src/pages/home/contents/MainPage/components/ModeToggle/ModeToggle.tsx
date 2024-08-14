import { MouseEvent } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

interface ModeToggleProps {
  mode: 'create' | 'search';
  onModeChange: (
    event: MouseEvent<HTMLElement>,
    newMode: 'create' | 'search'
  ) => void;
}

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={onModeChange}
      aria-label="mode"
      className="my-4"
    >
      <ToggleButton value="create" aria-label="create">
        create
      </ToggleButton>
      <ToggleButton value="search" aria-label="search">
        search
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ModeToggle;
