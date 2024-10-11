
import express, { Request, Response } from 'express';
import { PrismaClient }               from '@prisma/client';
import { body, validationResult }     from 'express-validator';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

interface RequestLoginData {
    id: string,
    password: string
}

const LOGIN_VALIDATION = [
    body("id").notEmpty().isString().withMessage("INVALID_ID_DATA"),
    body("password").notEmpty().isString().withMessage("INVALID_PW_DATA")
];


router.post('/', LOGIN_VALIDATION, async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(400).json({
            status: 'fail',
            result: errors.array()
        });
        return;
    }
    
    const requestData: RequestLoginData = request.body;
    const findUser = await prisma.user.findFirst({
        where: {
            AND: [
                { id: requestData.id },
                { password: requestData.password }
            ]
        }
    });

    if (!findUser) {
        response.status(400).json({
            status: "fail",
            result: "NOT_FOUND_USER" 
        });
        return;
    }

    response.json({
        status: "ok",
        result: jwt.sign(JSON.stringify({id: findUser.id, isAdmin: findUser.isAdmin}), process.env.SECRET_KEY as string)
    });
});


export default router;