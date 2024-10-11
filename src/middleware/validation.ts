import { Request, Response } from "express";
import fs from 'fs';
import path from "path";

const ROOT = process.env.SDMS;

export function objectValidation (request: Request, response: Response, next: any) {
    if (request.query.object) {
        if (!isValid(request.query.object as string)) {
            response.json({
                status: 'fail',
                result: 'OBJECT_IS_NOT_FOUND'
            });
            return;
        }
    }

    if (request.body.object) {
        if (!isValid(request.body.object)) {
            response.json({
                status: 'fail',
                result: 'OBJECT_IS_NOT_FOUND'
            });
            return;
        }
    }

    next();
}

function isValid (objectPath: string) {
    const fullPath = path.join(ROOT as string, objectPath);
    return fs.existsSync(fullPath);
}
