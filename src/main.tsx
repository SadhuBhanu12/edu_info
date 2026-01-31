import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './design-tokens.css';
import './index.css';
import App from './App.tsx';
import { initPerformanceMonitoring } from './utils/performance';

// Initialize performance monitoring
initPerformanceMonitoring();

// Mark app initialization
if ('performance' in window && performance.mark) {
  performance.mark('app-init-start');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Mark app render complete
if ('performance' in window && performance.mark) {
  performance.mark('app-init-end');
  performance.measure('app-initialization', 'app-init-start', 'app-init-end');
}
