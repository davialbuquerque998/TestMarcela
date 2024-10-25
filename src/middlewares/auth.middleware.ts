import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/auth';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.redirect('/admin/login');
    }

    if (!verifyToken(token)) {
        res.clearCookie('token');
        return res.redirect('/admin/login');
    }

    next();
};
