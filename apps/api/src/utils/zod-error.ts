import { ZodError } from 'zod';

const zodError = (error: ZodError) => {
  const errorMessage = `${error.issues[0].path} ${error.issues[0].message}`;
  return errorMessage.toUpperCase();
  //   return error.issues;
};

export { zodError };
