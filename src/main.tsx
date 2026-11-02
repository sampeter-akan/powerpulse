import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent benign HMR WebSocket disconnection errors from bubbling in iframe environments
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonMsg = String(event.reason?.message || event.reason || '');
    if (reasonMsg.includes('WebSocket') && reasonMsg.includes('closed without opened')) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
