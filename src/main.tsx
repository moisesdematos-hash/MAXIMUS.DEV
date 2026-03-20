import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <UIProvider>
            <App />
          </UIProvider>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
