import { app } from './app';
import env from './config/env';
import { connectDB } from './db';
import { NodeEnv } from './types';

const PORT = env.PORT ?? 3000;
const HOST =
  env.NODE_ENV === NodeEnv.PRODUCTION ? env.HOST : `http://localhost:${PORT}`;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server is running on ${HOST}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start the server:', error);
    process.exit(1);
  });
