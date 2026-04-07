/**
 * main.tsx — Application entry point
 *
 * Mounts the React app into the DOM. Imported by index.html via Vite.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
