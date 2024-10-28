import { User } from '../types/user.type';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const ADMIN_USERNAME = `${process.env.ADMIN_USERNAME}`;
const ADMIN_PASSWORD = `${process.env.ADMIN_PASSWORD}`;
const JWT_SECRET = `${process.env.JWT_SECRET}`;

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

export const validateCredentials = async (user: User): Promise<boolean> => {
    const hashedPassword = await hashPassword(ADMIN_PASSWORD);
    return user.username === ADMIN_USERNAME && 
           await bcrypt.compare(user.password, hashedPassword);
};

export const generateToken = (username: string): string => {
    return jwt.sign(
        { username }, 
        JWT_SECRET, 
        { 
            expiresIn: '1h',
            algorithm: 'HS256',
            audience: 'your-app',
            issuer: 'your-app'
        }
    );
};

export const verifyToken = (token: string): boolean => {
    try {
        jwt.verify(token, JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
};