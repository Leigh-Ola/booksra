import { HttpException, HttpStatus } from '@nestjs/common';

export const throwBadRequest = (message: string) => {
  throw new HttpException(message, HttpStatus.BAD_REQUEST);
};
export const throwUnauthorized = (message: string) => {
  throw new HttpException(message, HttpStatus.UNAUTHORIZED);
};
// function to generate random string of length n
export const generateRandomString = (
  n: number,
  addTimestampPrefix: boolean = false,
) => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  if (addTimestampPrefix) {
    token = new Date().getTime() + token;
  }
  return token;
};
// function to generate random number string of length n
export const generateRandomNumberString = (n: number) => {
  const chars = '0123456789';
  let token = '';
  for (let i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
};
export const toPostGresUTC = (date: Date) => {
  const date_ = date.toISOString().replace('T', ' ').replace('Z', '');
  // this becomes 2023-09-06 17:29:40.015
  // we need to remove the milliseconds
  return date_.substring(0, date_.indexOf('.')).trim() + '+00';
};
