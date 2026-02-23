import { HttpStatus } from '../types';
import { FailureReason } from './result';

export const errorReasonToHttpStatus = (reason: FailureReason): HttpStatus => {
  switch (reason) {
    case 'ALREADY_EXISTS':
    case 'CONFLICT':
      return HttpStatus.CONFLICT;

    case 'UNAUTHORIZED':
      return HttpStatus.UNAUTHORIZED;

    case 'FORBIDDEN':
      return HttpStatus.FORBIDDEN;

    case 'NOT_FOUND':
      return HttpStatus.NOT_FOUND;

    case 'DB_ERROR':
      return HttpStatus.INTERNAL_SERVER_ERROR;

    default:
      return HttpStatus.INTERNAL_SERVER_ERROR;
  }
};
