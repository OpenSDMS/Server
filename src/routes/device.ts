import express from 'express';
import { PrismaClient } from '@prisma/client';
import sign from '../middleware/sign';

const router = express.Router();
const prisma = new PrismaClient();


interface RequestCreateDevice {
    name: string,
    repositoryId: number,
    rawFilePath: string,
    model?: string,
}


router.get('/', async (request, response) => {
    let { deviceId }: any = request.query;

    if (!deviceId) {
        response.json(await prisma.device.findMany());
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
        where: {
            id: deviceId
        }
    }));
});


router.post('/', async (request, response) => {
    const requestData: RequestCreateDevice = request.body;

    try {
        const findDevice = await prisma.device.findFirst({
            where: { name: requestData.name }
        });
        
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

        console.log(err);
    }
});


export default router;