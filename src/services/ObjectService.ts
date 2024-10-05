
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const ROOT = process.env.SDMS || "/";

const prisma = new PrismaClient();

export async function createDevice (userId: string, objectName: string) {
    const fullPath = path.join(ROOT, objectName);

    if (fs.existsSync(fullPath)) {
        throw new Error("DUPLICATE_DEVICE_NAME");
    }

    const findUser = await prisma.user.findUnique({where: {id: userId}});
    if (!findUser) {
        throw new Error("USER_NOT_FOUND");
    }

    fs.mkdirSync(fullPath);
    const resultMetadata = await prisma.objectMetaData.create({
        data: {
            id: fullPath,
            userId: findUser.id,
            type: "DEVICE" 
        }
    });
    
    return resultMetadata;
}

export async function createRepository (userId: string, device: string, objectName: string) {
    let fullPath = path.join(ROOT, device);

    if (!fs.existsSync(fullPath)) {
        throw new Error("DEVICE_NOT_FOUND");
    }

    fullPath = path.join(ROOT, device, objectName);
    if (fs.existsSync(fullPath)) {
        throw new Error("DUPLICATE_OBJECT");
    }

    const findUser = await prisma.user.findUnique({where: {id: userId}});
    if (!findUser) {
        throw new Error("USER_NOT_FOUND");
    }
    
    fs.mkdirSync(fullPath);
    const resultMetadata = await prisma.objectMetaData.create({
        data: {
            id: fullPath,
            userId: findUser.id,
            type: "REPOSITORY" 
        }
    });

    return resultMetadata;
}


export async function createRawData (userId: string, savePath: string, objectName: string) {
    
}