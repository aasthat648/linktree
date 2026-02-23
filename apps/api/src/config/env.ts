import { NodeEnv } from '../types';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.nativeEnum(NodeEnv).default(NodeEnv.DEVELOPMENT),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('http://localhost'),
  CORS_ORIGIN: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRY: z.string(),
  MONGODB_URL: z.string(),
  MONGODB_DATABASE: z.string(),
});

export default schema.parse(process.env);
