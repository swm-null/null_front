import { BrowserRouter } from 'react-router-dom';
import { Router } from 'pages';
import { AlertProvider, ApiProvider } from 'utils';
import 'i18n';
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <AlertProvider>
        <ApiProvider>
          <Router />
        </ApiProvider>
      </AlertProvider>
    </BrowserRouter>
  );
};

export default App;
