import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAdmin, sign } from '../middleware/authentication';
import { body, query, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

interface RequestCreateDevice {
    name: string,
    repositoryId: number,
    rawFilePath: string,
    model?: string,
    ips?: string[]
}

const GET_DEVICE_VALIDATION = [
    query("deviceId").optional().isInt()
];

const CREATE_DEVICE_VALIDATION = [
    body("name").notEmpty().isString(),
    body("repositoryId").optional().isNumeric(),
    body("rawFilePath").notEmpty(),
    body("model").optional().isString(),
    body("ips").optional().isArray()
];


router.get('/', sign, isAdmin, async (request: any, response: Response) => {    
    let { deviceId }: any = request.query;

    if (!deviceId) {
        const results = await prisma.device.findMany();
        response.json(results)
        return;
    }

    const result = await prisma.device.findUnique({ where: { name: deviceId }});
    response.json(result);
});


router.post('/', sign, isAdmin, CREATE_DEVICE_VALIDATION, async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(400).json({
            status: 'fail',
            result: errors.array()
        });
        return;
    }

    const requestData: RequestCreateDevice = request.body;
    
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
                ips: {
                    create: requestData.ips?.map(ip => ({ip})) || []
                }
            }
        });

        response.json(result);
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            status: 'fail',
            result: 'PARAMETER_MALFORMED'
        });
    }
});


export default router;