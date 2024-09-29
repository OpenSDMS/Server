
import express, { Request, Response } from 'express';
import { sign, isAdmin } from '../middleware/authentication';
import { PrismaClient } from '@prisma/client';
import { check, query, body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

interface RequestCreateUser {
    id:        string,
    name:      string,
    groupId?:  string,
    isAdmin?:  boolean,
}

const CREATE_USER_VALIDATION = [
    body("id").notEmpty().withMessage("ID_IS_NOT_NULL_AND_MUST_STRING"),
    body("name").notEmpty().withMessage("NAME_IS_NOT_NULL"),
    body("groupId").optional({nullable: true}).isInt().withMessage("groupId_IS_NOT_NUMBER"),
    body("isAdmin").optional({nullable: true}).isBoolean().withMessage("isAdmin_IS_NOT_BOOLEAN")
];

const GET_USER_VALIDATION = [
    query("userId").optional({nullable: true}).isInt().withMessage("userId_IS_NOT_NUMBER")
]

router.get('/', sign, isAdmin, GET_USER_VALIDATION, async (request: Request, response: Response) => {

});

router.post('/', sign, isAdmin, CREATE_USER_VALIDATION, async (request: any, response: Response) => {
    const requestData: RequestCreateUser = request.body;

    // 관리자 권한 확인
    if (!request.login.isAdmin) {
        response.status(400).json({
            status: 'fail',
            result: 'PERMISSION_DENY'
        });

        return;
    }

    const result = await prisma.user.create({
        data: {
            id: requestData.id,
            password: "tmp1234",
            name: requestData.name,
            isAdmin: request.isAdmin,
        }
    });

    response.json(result);
});

export default router;