import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import apiApp from './api/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isVercel = Boolean(process.env.VERCEL);
const isProduction = process.env.NODE_ENV === 'production' || isVercel;

// Mount API routes
app.use(apiApp);

// Mount Vite middleware in local development, or serve static files in standalone Node production
if (!isProduction && !isVercel) {
  const { createServer: createViteServer } = await import('vite');
  const isHmrDisabled = process.env.DISABLE_HMR === 'true';
  const vite = await createViteServer({
    server: { 
      middlewareMode: true, 
      host: '0.0.0.0', 
      port,
      hmr: isHmrDisabled ? false : undefined,
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else if (!isVercel) {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Start standalone HTTP server when not in serverless environment
if (!isVercel) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`PowerPulse Global Utility Server listening on http://0.0.0.0:${port}`);
  });
}

export default app;
