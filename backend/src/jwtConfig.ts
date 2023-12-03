import jwt from 'jsonwebtoken';

const SECRET_KEY = 'superdupersecretkeywhocanseethesecretkey';

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '72h' });

};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);

  } catch (error: unknown) {
    return null;

  }
};
