import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initializeTheme } from './stores/themeStore'

// Initialize theme before render to prevent flash
initializeTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
