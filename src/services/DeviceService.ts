
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const ROOT   = process.env.SDMS || "/";
const prisma = new PrismaClient({ log: ['query'] });

interface DeviceOptions {
    ips: string[],
    rawdataPath: string
}


export async function createDevice (userId: string, name: string, options: DeviceOptions) {
    const fullPath = path.join(ROOT, name);

    console.log(options);
    
    try {
        fs.mkdirSync(fullPath);

        return await prisma.$transaction(async (tx) => {
            const newObjectMetaData = await tx.objectMetaData.create({
                data: {
                    id: fullPath,
                    userId,
                    type: "DEVICE",
                }
            });
            
            const newObjectMetaDataExtension = await tx.objectMetaDataExtention.create({
                data: {
                    objectMetaDataId: newObjectMetaData.id,
                    rawDataPath: options.rawdataPath,
                }
            });
            
            const ips = options.ips.map(ip => ({ objectId: newObjectMetaData.id, host: ip }));
            const newHostIps = await tx.hostIps.createMany({ data: ips });

            return { newObjectMetaData, newObjectMetaDataExtension, newHostIps };
        });
    }
    catch {
        if (fs.existsSync(fullPath)) { fs.rmdirSync(fullPath); }
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
                        id: { contains: path.join(ROOT, device, '/'), endsWith: '/' }
                    }
                }
            ]
        }
    });    
}