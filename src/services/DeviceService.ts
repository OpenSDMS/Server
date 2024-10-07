
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const ROOT = process.env.SDMS || "/";

const prisma = new PrismaClient({
    log: ['query']
});


export async function createDevice (userId: string, name: string) {
    const fullPath = path.join(ROOT, name);
    
    try {
        fs.mkdirSync(fullPath);
        const resultMetadata = await prisma.objectMetaData.create({
            data: {
                id: fullPath,
                userId,
                type: "DEVICE",
            }
        });
        return resultMetadata;
    }
    catch {
        if (fs.existsSync(fullPath)) {
            fs.rmdirSync(fullPath);
        }

        throw new Error("CREATE_DEVICE_TRANSACTION_FAILED");
    }
}

export async function getDeivces (userId: string) {
    return await prisma.objectMetaData.findMany({
        where: {
            type: "DEVICE"
        },
        include: {
            user: true,
        }
    });
}

export async function getDeviceItems (userId: string, device: string) {
    return await prisma.objectMetaData.findMany({
        where: {
            AND: [
                { id: { startsWith: path.join(ROOT, device, '/') }},
                {
                    NOT: {
                        id: { contains: path.join(ROOT, device, '/'), endsWith: '/'}
                    }
                }
            ]
        }
    });    
}