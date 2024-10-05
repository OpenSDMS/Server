
import express, { Request, Response } from 'express';
import { createDevice, createRepository } from '../services/ObjectService';

const router = express.Router();


interface RequestCreateDevice {
    name: string
}

interface RequestCreateRepository {
    device: string
    name: string
}

interface RequestCreateRawData {

}


router.post('/device', async (request: Request, response: Response) => {
    const requestData: RequestCreateDevice = request.body;
    const object = await createDevice('root', requestData.name);
    response.json(object);
});

router.post('/repository', async (request: Request, response: Response) => {
    const requestData: RequestCreateRepository = request.body;
    const object = await createRepository('root', requestData.device, requestData.name);
    response.json(object);
});

router.post('/rawdata', async (request: Request, response: Response) => {

});

export default router;