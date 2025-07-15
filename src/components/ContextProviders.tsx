import React, { useMemo } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import { NotificationProvider } from '../context/NotificationContext';

interface ContextProvidersProps {
  children: React.ReactNode;
}

// Composant optimisé pour regrouper tous les providers
// et éviter les re-renders inutiles
const ContextProviders: React.FC<ContextProvidersProps> = ({ children }) => {
  // Mémorisation de la structure des providers pour éviter les re-renders
  const providers = useMemo(() => [
    AuthProvider,
    LanguageProvider,
    CurrencyProvider,
    ThemeProvider,
    ToastProvider,
    NotificationProvider
  ], []);

  // Réduction des providers en une seule structure
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  ) as React.ReactElement;
};

export default React.memo(ContextProviders);
