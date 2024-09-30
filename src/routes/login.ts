
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();


const LOGIN_VALIDATION = [
    body("id").notEmpty().isString().withMessage("INVALID_ID_DATA"),
    body("password").notEmpty().isString().withMessage("INVALID_PW_DATA")
];


router.post('/', LOGIN_VALIDATION, async (request: Request, response: Response) => {
    const requestBody: any = request.body;

    // 파라미터 검증
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(400).json({
            status: 'fail',
            result: errors.array()
        });

        return;
    }

    const findUser = await prisma.user.findFirst({
        where: { 
            AND: [
                { id: requestBody.id },
                { password: requestBody.password }
            ]
        }
    });

    // 유저가 존재하는지 확인
    if (!findUser) {
        response.status(400).json({
            status: 'fail',
            result: 'NOT_FOUND_USER'
        });
        return;
    }

    const { id, isAdmin } = findUser;
    response.status(200).json({
        status: "ok",
        result: jwt.sign({ id, isAdmin }, process.env.SECRET_KEY as string)
    });
});


export default router;