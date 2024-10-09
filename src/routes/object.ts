
import express, { Request, Response } from 'express';
import { createDevice, getDeivces } from '../services/DeviceService';
import { createRepository } from '../services/RepositoryService';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();


router.get('/query', async (request: Request, response: Response) => {
    const ROOT = process.env.SDMS as string;
    const { target } = request.query;

    const result = await prisma.objectMetaData.findMany({
        where: {
            AND: [
                { id:  { startsWith: path.join(ROOT, target as string, '/') } },
                { NOT: { id: { contains: path.join(ROOT, target as string, '/'), endsWith: '/'} } }
            ]
        }
    }); 

    response.json({
        status: 'ok',
        result
    });
});


router.get('/device', async (request: Request, response: Response) => {
    
    const devices = (await getDeivces("root")).map(device => ({
        id: device.id,
        name: path.basename(device.id),
        user: device.user.name,
        createdAt: device.createdAt,
        type: device.type
    }));

    response.json({
        status: 'ok',
        result: devices
    });
});


router.post('/device', async (request: Request, response: Response) => {
    const { name } = request.body;
    const object = await createDevice('root', name);
    response.json(object);
});


router.post('/repository', async (request: Request, response: Response) => {
    const requestData = request.body;
    const object = await createRepository('root', requestData.destination, requestData.name);
    response.json(object);
});


router.post('/rawdata', async (request: Request, response: Response) => {

});

export default router;