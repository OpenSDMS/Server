import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import { query, body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

interface RequestCreateRepository {
    name: string,
    parentId: number,
}

const GET_VALIDATION = [
    query("repositoryId").optional({nullable: true}).isInt().withMessage("IS_NOT_NUMBER_TYPE")
];

const CREATE_VALIDATION = [
    body("name").notEmpty().withMessage("NAME_IS_EMPTY"),
    body("parentId").optional({nullable: true}).isInt().withMessage("IS_NOT_NUMBER")
];

// 특정 저장소 혹은 전체 저장소 조회
router.get('/', GET_VALIDATION, async (request: Request, response: Response) => {
    const { repositoryId }: any = request.query;

    if (!repositoryId) {
        response.json(await prisma.repository.findMany());
        return;
    }

    const errors = validationResult(request);
    if (errors.isEmpty()) {
        response.status(400).json({
            status: 'fail',
            result: errors.array()
        });
        return;
    }
    
    response.json(await prisma.device.findFirst({
        where: {
            id: repositoryId
        }
    }));
});


// 저장소 생성
router.post('/', CREATE_VALIDATION, async (request: Request, response: Response) => {
    const requestData: RequestCreateRepository = request.body;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(400).json({
            status: 'fail',
            result: errors.array()
        });
        return;
    }

    try {
        const findRepository = await prisma.repository.findFirst({
            where: { name: requestData.name }
        });
        
        if (findRepository) {
            response.status(400).json({
                status: 'fail',
                result: 'DUPLICATE_DEVICE_NAME'
            });
            return;
        }

        const result = await prisma.repository.create({
            data: {
                name: requestData.name,
                parentId: requestData.parentId
            }
        });

        response.json(result);
    }
    catch {
        response.json({
            status: 'fail',
            result: "MARFORMED_PARAMETER"
        });
        return;
    }
});

export default router;