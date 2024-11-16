import { Button, Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function CopyTextField({ text }: { text: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      alert('텍스트가 클립보드에 복사되었습니다.');
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px',
        maxWidth: '300px',
        background: 'white',
      }}
    >
      <p className="flex flex-1">{text}</p>
      <Button sx={{ minWidth: 'auto', marginLeft: '8px' }} onClick={handleCopy}>
        <ContentCopyIcon />
      </Button>
    </Box>
  );
}

export default CopyTextField;
