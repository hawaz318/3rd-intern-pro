import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const secret = process.env.JWT_SECRET!;

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);
export const signToken = (payload: object) => jwt.sign(payload, secret, { expiresIn: '1d' });
export const verifyToken = (token: string) => jwt.verify(token, secret);
