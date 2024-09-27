import { BrowserRouter } from 'react-router-dom';
import 'i18n';
import './index.css';
import { Router } from 'pages';

const App = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};

export default App;
