import { BrowserRouter } from 'react-router-dom';
import 'i18n';
import './index.css';
import { Router } from 'pages';
import { AlertDialog } from 'utils/dialog';

const App = () => {
  return (
    <AlertDialog>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AlertDialog>
  );
};

export default App;
