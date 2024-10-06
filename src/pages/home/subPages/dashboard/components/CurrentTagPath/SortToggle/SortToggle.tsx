import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import { DownIcon } from 'assets/icons';
import { useTranslation } from 'react-i18next';

export default function SortToggle({
  sortOption,
  setSortOption,
}: {
  sortOption: 'latest' | 'oldest' | 'name';
  setSortOption: (sortOption: 'latest' | 'oldest' | 'name') => void;
}) {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value as 'latest' | 'oldest' | 'name');
  };

  return (
    <FormControl variant="outlined">
      <Select
        value={sortOption}
        onChange={handleChange}
        IconComponent={DownIcon}
        className="flex items-center h-8 w-[110px] shadow-custom bg-clip-padding"
        sx={{
          borderRadius: '16px',
          backgroundColor: '#FFF6E3',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          '&:hover, &:focus': {
            border: '1px solid rgba(0, 0, 0, 0.1)',
            backgroundColor: '#FFF6E3',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSelect-select': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          '& .MuiSelect-icon': {
            top: '12%',
          },
        }}
        renderValue={(selected) => t(`pages.dashboard.toggle.${selected}`)}
      >
        <MenuItem value="latest">{t('pages.dashboard.toggle.latest')}</MenuItem>
        <MenuItem value="oldest">{t('pages.dashboard.toggle.oldest')}</MenuItem>
        <MenuItem value="name">{t('pages.dashboard.toggle.name')}</MenuItem>
      </Select>
    </FormControl>
  );
}
