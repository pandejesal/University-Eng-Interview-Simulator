import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

document.addEventListener('keydown', (e) => {
  const ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
});

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
