import { CookieOptions } from 'express';
import { NodeEnv } from '../types';
import env from './env';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true, // MUST be true
  sameSite: 'none', // required for cross-site
  maxAge: 1000 * 60 * 60 * 24,
  path: '/',
};
