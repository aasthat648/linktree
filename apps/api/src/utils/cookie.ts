import { Request, Response } from 'express';
import { cookieOptions } from '@/config/cookies';

export const setCookie = (res: Response, key: string, data: any) => {
  console.log('---- Set cookie called');
  res.cookie(key, data, cookieOptions);
};

export const getCookie = (req: Request, key: string) => {
  console.log('--- get cookie : ', req.cookies?.[key]);
  return req.cookies?.[key];
};

export const removeCookie = (res: Response, key: string) => {
  res.clearCookie(key);
};
