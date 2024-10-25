import { User } from '../types/user.type';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const validateCredentials = async (user: User): Promise<boolean> => {
    return user.username === ADMIN_USERNAME && user.password === ADMIN_PASSWORD;
};

export const generateToken = (username: string): string => {
    return jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): boolean => {
    try {
        jwt.verify(token, JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
};