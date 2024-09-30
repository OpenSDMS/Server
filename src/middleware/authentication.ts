
import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';

export function sign (request: any, response: Response, next: NextFunction) {
    const authorization = request.header('Authorization');
    
    if (!authorization) {
        response.status(401).json({
            status: 'fail',
            result: 'UNAUTHORIZATION'
        });
        return;
    }
    
    try {
        const verify = jwt.verify(authorization, process.env.SECRET_KEY as string);
        request.login = verify;
        next();
    }
    catch {
        response.status(401).json({
            status: 'fail',
            result: 'MALFORMED_LOGIN_DATA'
        });
    }
}

export function isAdmin (request: any, response: Response, next: NextFunction) {    
    if (!request.login.isAdmin) {
        response.status(401).json({
            status: 'fail',
            result: 'PERMISSION_DENY'
        });
        return;
    }

    next();
}