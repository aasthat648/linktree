export type FailureReason =
  | 'ALREADY_EXISTS'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'DB_ERROR'
  | 'UNKNOWN';

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; reason: FailureReason; message: string; meta?: unknown };

// Helper creators

export const ok = <T>(data: T): Result<T> => ({
  ok: true,
  data,
});

export const fail = (
  reason: FailureReason,
  message: string,
  meta?: unknown,
): Result<never> => ({
  ok: false,
  reason,
  message,
  meta,
});
