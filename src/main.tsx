import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index-simple.css';

// Exposer les services admin globalement pour la console
import { AdminCreationService } from './services/adminCreationService';
import { AdminRedirectionDiagnostic } from './utils/adminRedirectionDiagnostic';

// Rendre les services disponibles dans la console du navigateur
if (typeof window !== 'undefined') {
  (window as any).AdminCreationService = AdminCreationService;
  (window as any).AdminRedirectionDiagnostic = AdminRedirectionDiagnostic;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);