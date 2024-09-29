import App from 'App';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');
rootElement &&
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
