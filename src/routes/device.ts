import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAdmin, sign } from '../middleware/authentication';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

interface RequestCreateDevice {
    name: string,
    repositoryId: number,
    rawFilePath: string,
    model?: string,
}

const CREATE_DEVICE_VALIDATION = [
    body("name").notEmpty().isString(),
    body("repositoryId").optional({nullable: true}).isNumeric(),
    body("rawFilePath").notEmpty(),
    body("model").optional({nullable: true}).isString()
];


router.get('/', sign, async (request: any, response) => {
    let { deviceId }: any = request.query;

    if (!deviceId) {
        if (request.login.isAdmin) {
            response.json(await prisma.device.findMany());
        }
        else {
            
        }

        return;
    }
    
    deviceId = parseInt(deviceId, 10);
    if (isNaN(deviceId)) {
        response.status(400).json({
            status: 'fail',
            result: 'IS_NOT_NUMBER_TYPE'
        });
        return;
    }
    
    response.json(await prisma.device.findFirst({
        where: { id: deviceId }
    }));
});


router.post('/', sign, isAdmin, CREATE_DEVICE_VALIDATION, async (request: Request, response: Response) => {
    const requestData: RequestCreateDevice = request.body;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(400).json({
            status: 'fail',
            result: errors.array()
        });
        return;
    }

    try {
        const findDevice = await prisma.device.findFirst({ where: { name: requestData.name } });
        
        if (findDevice) {
            response.status(400).json({
                status: 'fail',
                result: 'DUPLICATE_DEVICE_NAME'
            });

            return;
        }
          
        const result = await prisma.device.create({
            data: {
                name: requestData.name,
                rawFilePath: requestData.rawFilePath,
                model: requestData.model,
            }
        });

        response.json(result);
    }
    catch (err) {
        response.status(400).json({
            status: 'fail',
            result: 'PARAMETER_MALFORMED'
        });
    }
});


export default router;