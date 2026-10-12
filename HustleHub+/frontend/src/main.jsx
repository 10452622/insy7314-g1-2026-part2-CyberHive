import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RegistrationProvider } from './context/RegistrationContext.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RegistrationProvider>
    <App />
  </RegistrationProvider>
  </StrictMode>, /* //(MDN Web Docs, 2026) */
)


/* Reference List:
    1. MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 8 October 2026]. */
