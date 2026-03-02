import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (
  password: string,
  hashPassword: string | undefined,
): Promise<boolean> => {
  if (!hashPassword || typeof hashPassword !== 'string') return false;
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch {
    return false;
  }
};

export const removePassword = <T extends { passwordHash?: string }>(data: T) => {
  const { passwordHash, ...rest } = data;
  return rest;
};
