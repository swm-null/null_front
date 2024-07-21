import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';

const rootElement = document.getElementById('root');
rootElement &&
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
