import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/auth';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        res.redirect('/admin/login');
        return;
    }

    if (!verifyToken(token)) {
        res.clearCookie('token');
        res.redirect('/admin/login');
        return;
    }

    next();
    return;
};
